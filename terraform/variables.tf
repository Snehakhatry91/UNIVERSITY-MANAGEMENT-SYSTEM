variable "aws_region" {
  description = "AWS Primary Production Region for CVGU Cloud Infrastructure"
  type        = string
  default     = "ap-south-1"
}

variable "environment" {
  description = "Deployment Environment Tier"
  type        = string
  default     = "production"
}

variable "vpc_cidr" {
  description = "VPC CIDR Block"
  type        = string
  default     = "10.0.0.0/16"
}

variable "on_premises_cidr" {
  description = "CVGU Bhubaneswar Campus Data Center CIDR Block"
  type        = string
  default     = "172.16.0.0/16"
}

variable "campus_cgw_ip" {
  description = "Public IP Address of CVGU Campus Boundary Cisco Router"
  type        = string
  default     = "103.112.48.1"
}

variable "db_instance_class" {
  description = "RDS PostgreSQL Instance Class"
  type        = string
  default     = "db.r6g.xlarge"
}

variable "db_username" {
  description = "RDS Master Database Username"
  type        = string
  default     = "cvgu_db_admin"
}

variable "db_password" {
  description = "RDS Master Database Password (stored via AWS Secrets Manager or secure CI/CD secrets)"
  type        = string
  sensitive   = true
  default     = "ChangeMeInProductionKmsEncrypted123!"
}

