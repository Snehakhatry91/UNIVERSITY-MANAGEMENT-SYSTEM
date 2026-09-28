# ==============================================================================
# AUTO SCALING GROUP & APPLICATION SERVER FLEET
# ==============================================================================

resource "aws_security_group" "app_server_sg" {
  name        = "cvgu-app-server-security-group"
  description = "Allows incoming traffic strictly from ALB target group"
  vpc_id      = aws_vpc.cvgu_vpc.id

  ingress {
    description     = "Allow port 8080 from ALB only"
    from_port       = 8080
    to_port         = 8080
    protocol        = "tcp"
    security_groups = [aws_security_group.alb_sg.id]
  }

  egress {
    description = "Allow egress to RDS PostgreSQL Port 5432"
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["10.0.10.0/24", "10.0.11.0/24"]
  }

  egress {
    description = "Allow hybrid traffic over VPN to On-Premises DC"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = [var.on_premises_cidr]
  }

  egress {
    description = "Allow outbound to NAT Gateway for S3/KMS/SSM endpoints"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "cvgu-app-server-sg"
  }
}

resource "aws_launch_template" "app_template" {
  name_prefix   = "cvgu-app-server-"
  image_id      = "ami-0c2af51e2a019f032" # Amazon Linux 2023 AMI
  instance_type = "c6i.xlarge"

  iam_instance_profile {
    name = aws_iam_instance_profile.app_instance_profile.name
  }

  network_interfaces {
    associate_public_ip_address = false
    security_groups             = [aws_security_group.app_server_sg.id]
  }

  # Enforce IMDSv2 to prevent SSRF credential theft
  metadata_options {
    http_endpoint               = "enabled"
    http_tokens                 = "required"
    http_put_response_hop_limit = 1
  }

  user_data = base64encode(<<-EOF
              #!/bin/bash
              echo "Initializing CVGU Application Server..."
              # Start production container and connect to RDS
              EOF
  )

  tag_specifications {
    resource_type = "instance"
    tags = {
      Name = "cvgu-app-server"
      Tier = "Application"
    }
  }
}

resource "aws_autoscaling_group" "app_asg" {
  name_prefix         = "cvgu-app-asg-"
  vpc_zone_identifier = [aws_subnet.private_app_az_a.id, aws_subnet.private_app_az_b.id]
  target_group_arns   = [aws_lb_target_group.app_tg.arn]

  min_size         = 2
  max_size         = 10
  desired_capacity = 2

  health_check_type         = "ELB"
  health_check_grace_period = 300

  launch_template {
    id      = aws_launch_template.app_template.id
    version = "$Latest"
  }

  tag {
    key                 = "Name"
    value               = "cvgu-asg-app-instance"
    propagate_at_launch = true
  }
}

# Target Tracking Scaling Policy: Target Average CPU Utilization at 70%
resource "aws_autoscaling_policy" "cpu_target_tracking" {
  name                   = "cvgu-asg-cpu-target-policy"
  autoscaling_group_name = aws_autoscaling_group.app_asg.name
  policy_type            = "TargetTrackingScaling"

  target_tracking_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ASGAverageCPUUtilization"
    }
    target_value = 70.0
  }
}
