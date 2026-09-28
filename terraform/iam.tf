# ==============================================================================
# IDENTITY AND ACCESS MANAGEMENT (IAM) & SAML 2.0 FEDERATION
# ==============================================================================

# 1. SAML 2.0 Identity Provider (Campus Active Directory IdP)
resource "aws_iam_saml_provider" "cvgu_campus_idp" {
  name                   = "CVGU-Campus-ActiveDirectory-IdP"
  saml_metadata_document = <<-EOF
    <?xml version="1.0" encoding="UTF-8"?>
    <EntityDescriptor entityID="https://ad.cvrgu.edu.in/adfs/services/trust">
      <SPSSODescriptor protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol"/>
    </EntityDescriptor>
  EOF

  tags = {
    Name = "cvgu-campus-idp"
  }
}

# 2. EC2 Application Server Role
resource "aws_iam_role" "app_server_role" {
  name = "cvgu-app-server-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_policy" "app_least_privilege_policy" {
  name        = "cvgu-app-least-privilege"
  description = "Allows access to encrypted S3, KMS keys, and Secrets Manager"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "S3StudentSubmissionsAccess"
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject"
        ]
        Resource = "arn:aws:s3:::cvgu-student-submissions-encrypted/*"
      },
      {
        Sid    = "KmsDecryption"
        Effect = "Allow"
        Action = [
          "kms:Decrypt",
          "kms:GenerateDataKey"
        ]
        Resource = "*"
      },
      {
        Sid    = "SecretsManagerDbCredentials"
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue"
        ]
        Resource = "arn:aws:secretsmanager:ap-south-1:123456789012:secret:cvgu/db/credentials-*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "app_policy_attach" {
  role       = aws_iam_role.app_server_role.name
  policy_arn = aws_iam_policy.app_least_privilege_policy.arn
}

resource "aws_iam_instance_profile" "app_instance_profile" {
  name = "cvgu-app-instance-profile"
  role = aws_iam_role.app_server_role.name
}

# 3. VPC Flow Logs IAM Role
resource "aws_iam_role" "vpc_flow_log_role" {
  name = "cvgu-vpc-flow-logs-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "vpc-flow-logs.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "vpc_flow_log_policy" {
  name = "cvgu-vpc-flow-log-policy"
  role = aws_iam_role.vpc_flow_log_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
          "logs:DescribeLogGroups",
          "logs:DescribeLogStreams"
        ]
        Effect   = "Allow"
        Resource = "*"
      }
    ]
  })
}
