# ==============================================================================
# VPC AND NETWORK SEGMENTATION (3-TIER MULTI-AZ ARCHITECTURE)
# ==============================================================================

resource "aws_vpc" "cvgu_vpc" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "cvgu-production-vpc"
  }
}

# 1. Public Subnets (ALB, NAT Gateways)
resource "aws_subnet" "public_az_a" {
  vpc_id                  = aws_vpc.cvgu_vpc.id
  cidr_block              = "10.0.0.0/24"
  availability_zone       = "ap-south-1a"
  map_public_ip_on_launch = true

  tags = {
    Name = "cvgu-public-subnet-az-a"
    Tier = "Public"
  }
}

resource "aws_subnet" "public_az_b" {
  vpc_id                  = aws_vpc.cvgu_vpc.id
  cidr_block              = "10.0.128.0/24"
  availability_zone       = "ap-south-1b"
  map_public_ip_on_launch = true

  tags = {
    Name = "cvgu-public-subnet-az-b"
    Tier = "Public"
  }
}

# 2. Private Application Subnets (EC2 Application Server Fleet)
resource "aws_subnet" "private_app_az_a" {
  vpc_id            = aws_vpc.cvgu_vpc.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "ap-south-1a"

  tags = {
    Name = "cvgu-private-app-az-a"
    Tier = "Application"
  }
}

resource "aws_subnet" "private_app_az_b" {
  vpc_id            = aws_vpc.cvgu_vpc.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = "ap-south-1b"

  tags = {
    Name = "cvgu-private-app-az-b"
    Tier = "Application"
  }
}

# 3. Private Isolated Database Subnets (RDS PostgreSQL Multi-AZ - NO Public IPs)
resource "aws_subnet" "private_db_az_a" {
  vpc_id            = aws_vpc.cvgu_vpc.id
  cidr_block        = "10.0.10.0/24"
  availability_zone = "ap-south-1a"

  tags = {
    Name = "cvgu-private-db-az-a"
    Tier = "Database"
  }
}

resource "aws_subnet" "private_db_az_b" {
  vpc_id            = aws_vpc.cvgu_vpc.id
  cidr_block        = "10.0.11.0/24"
  availability_zone = "ap-south-1b"

  tags = {
    Name = "cvgu-private-db-az-b"
    Tier = "Database"
  }
}

# Internet Gateway for Public Tier
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.cvgu_vpc.id

  tags = {
    Name = "cvgu-internet-gateway"
  }
}

# Elastic IP and NAT Gateway for Outbound Updates from App Servers
resource "aws_eip" "nat_eip_a" {
  domain = "vpc"
}

resource "aws_nat_gateway" "nat_gw_a" {
  allocation_id = aws_eip.nat_eip_a.id
  subnet_id     = aws_subnet.public_az_a.id

  tags = {
    Name = "cvgu-nat-gateway-az-a"
  }
}

# Route Tables
resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.cvgu_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = {
    Name = "cvgu-public-route-table"
  }
}

resource "aws_route_table" "private_app_rt" {
  vpc_id = aws_vpc.cvgu_vpc.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat_gw_a.id
  }

  route {
    cidr_block           = var.on_premises_cidr
    gateway_id           = aws_vpn_gateway.vgw.id
  }

  tags = {
    Name = "cvgu-private-app-route-table"
  }
}

resource "aws_route_table" "isolated_db_rt" {
  vpc_id = aws_vpc.cvgu_vpc.id

  # Notice: ZERO routes to 0.0.0.0/0. Completely isolated database tier.

  tags = {
    Name = "cvgu-isolated-db-route-table"
  }
}

# Associations
resource "aws_route_table_association" "pub_a" {
  subnet_id      = aws_subnet.public_az_a.id
  route_table_id = aws_route_table.public_rt.id
}

resource "aws_route_table_association" "pub_b" {
  subnet_id      = aws_subnet.public_az_b.id
  route_table_id = aws_route_table.public_rt.id
}

resource "aws_route_table_association" "app_a" {
  subnet_id      = aws_subnet.private_app_az_a.id
  route_table_id = aws_route_table.private_app_rt.id
}

resource "aws_route_table_association" "app_b" {
  subnet_id      = aws_subnet.private_app_az_b.id
  route_table_id = aws_route_table.private_app_rt.id
}

resource "aws_route_table_association" "db_a" {
  subnet_id      = aws_subnet.private_db_az_a.id
  route_table_id = aws_route_table.isolated_db_rt.id
}

resource "aws_route_table_association" "db_b" {
  subnet_id      = aws_subnet.private_db_az_b.id
  route_table_id = aws_route_table.isolated_db_rt.id
}

# VPC Flow Logs to CloudWatch Logs
resource "aws_cloudwatch_log_group" "vpc_flow_logs" {
  name              = "/aws/vpc/cvgu-flow-logs"
  retention_in_days = 90
}

resource "aws_flow_log" "cvgu_flow_log" {
  iam_role_arn    = aws_iam_role.vpc_flow_log_role.arn
  log_destination = aws_cloudwatch_log_group.vpc_flow_logs.arn
  traffic_type    = "ALL"
  vpc_id          = aws_vpc.cvgu_vpc.id
}
