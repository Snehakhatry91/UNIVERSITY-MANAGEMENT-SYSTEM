# ==============================================================================
# C. V. RAMAN GLOBAL UNIVERSITY (CVGU)
# SECURE HYBRID CLOUD INFRASTRUCTURE - TERRAFORM REFERENCE CONFIGURATION
#
# Target AWS Region: ap-south-1 (Mumbai)
# Multi-AZ High Availability: ap-south-1a, ap-south-1b
# Hybrid Link: CVGU Bhubaneswar Campus Data Center (172.16.0.0/16)
# ==============================================================================

terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "cvgu-terraform-state-prod"
    key            = "hybrid-architecture/terraform.tfstate"
    region         = "ap-south-1"
    encrypt        = true
    dynamodb_table = "cvgu-tf-state-locks"
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Institution = "C. V. Raman Global University"
      Project     = "Secure Hybrid Cloud UMS"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}
