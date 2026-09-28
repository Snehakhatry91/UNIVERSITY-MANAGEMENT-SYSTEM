# ==============================================================================
# APPLICATION LOAD BALANCER & INGRESS SECURITY
# ==============================================================================

resource "aws_security_group" "alb_sg" {
  name        = "cvgu-alb-security-group"
  description = "Allows ingress from CloudFront CDN and WAF proxies"
  vpc_id      = aws_vpc.cvgu_vpc.id

  ingress {
    description = "Allow HTTPS from Public Internet / CloudFront"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Allow HTTP for auto-redirect"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Route traffic to private application tier instances"
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["10.0.1.0/24", "10.0.2.0/24"]
  }

  tags = {
    Name = "cvgu-alb-sg"
  }
}

resource "aws_lb" "campus_alb" {
  name               = "cvgu-campus-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_sg.id]
  subnets            = [aws_subnet.public_az_a.id, aws_subnet.public_az_b.id]

  drop_invalid_header_fields = true
  enable_deletion_protection = true

  tags = {
    Name = "cvgu-campus-alb"
  }
}

resource "aws_lb_target_group" "app_tg" {
  name        = "cvgu-app-target-group"
  port        = 8080
  protocol    = "HTTP"
  vpc_id      = aws_vpc.cvgu_vpc.id
  target_type = "instance"

  health_check {
    enabled             = true
    path                = "/api/health"
    protocol            = "HTTP"
    port                = "8080"
    interval            = 15
    timeout             = 5
    healthy_threshold   = 3
    unhealthy_threshold = 2
    matcher             = "200"
  }

  tags = {
    Name = "cvgu-app-tg"
  }
}

resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.campus_alb.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS13-1-2-2021-06"
  certificate_arn   = "arn:aws:acm:ap-south-1:123456789012:certificate/cvgu-cvrgu-edu-in"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app_tg.arn
  }
}

resource "aws_lb_listener" "http_redirect" {
  load_balancer_arn = aws_lb.campus_alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type = "redirect"

    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}
