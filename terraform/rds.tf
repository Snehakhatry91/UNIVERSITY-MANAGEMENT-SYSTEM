# ==============================================================================
# PRIVATE DATABASE TIER (AMAZON RDS POSTGRESQL MULTI-AZ)
# ==============================================================================

resource "aws_db_subnet_group" "rds_subnet_group" {
  name        = "cvgu-rds-isolated-subnet-group"
  description = "Subnet group across two Availability Zones in isolated database tier"
  subnet_ids  = [aws_subnet.private_db_az_a.id, aws_subnet.private_db_az_b.id]

  tags = {
    Name = "cvgu-rds-subnet-group"
  }
}

resource "aws_security_group" "db_sg" {
  name        = "cvgu-db-security-group"
  description = "Accepts Port 5432 ONLY from Application Server security group"
  vpc_id      = aws_vpc.cvgu_vpc.id

  ingress {
    description     = "PostgreSQL access strictly from Application Fleet"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.app_server_sg.id]
  }

  # STRICT RULE: No ingress from public internet, no ingress from human client subnets.

  egress {
    description = "Deny all outbound from database tier"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["10.0.0.0/16"]
  }

  tags = {
    Name = "cvgu-db-sg"
  }
}

resource "aws_kms_key" "rds_key" {
  description             = "Customer Managed Key for CVGU PostgreSQL Database Encryption"
  deletion_window_in_days = 30
  enable_key_rotation     = true

  tags = {
    Name = "cvgu-rds-kms-key"
  }
}

resource "aws_db_instance" "postgres_primary" {
  identifier        = "cvgu-prod-postgresql"
  engine            = "postgres"
  engine_version    = "16.2"
  instance_class    = var.db_instance_class
  allocated_storage = 200
  storage_type      = "gp3"

  multi_az               = true # Synchronous Standby in secondary AZ
  publicly_accessible    = false # ZERO PUBLIC IP
  db_subnet_group_name   = aws_db_subnet_group.rds_subnet_group.name
  vpc_security_group_ids = [aws_security_group.db_sg.id]

  storage_encrypted = true
  kms_key_id        = aws_kms_key.rds_key.arn

  db_name  = "cvgu_ums_db"
  username = var.db_username
  password = var.db_password # Managed via secure variable / Secrets Manager

  backup_retention_period   = 35
  backup_window             = "19:00-20:00"
  maintenance_window        = "Sun:20:30-Sun:21:30"
  copy_tags_to_snapshot     = true
  deletion_protection       = true
  auto_minor_version_upgrade = true

  tags = {
    Name = "cvgu-prod-postgresql-multiaz"
  }
}
