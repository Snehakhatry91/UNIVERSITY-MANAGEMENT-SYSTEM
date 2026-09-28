# ==============================================================================
# SECURE OBJECT STORAGE (AWS S3) WITH KMS ENCRYPTION
# ==============================================================================

resource "aws_kms_key" "s3_submissions_key" {
  description             = "KMS CMK for CVGU Student Submissions & Course Assets"
  deletion_window_in_days = 30
  enable_key_rotation     = true

  tags = {
    Name = "cvgu-s3-kms-key"
  }
}

resource "aws_s3_bucket" "student_submissions_bucket" {
  bucket        = "cvgu-student-submissions-encrypted"
  force_destroy = false

  tags = {
    Name = "cvgu-student-submissions"
  }
}

resource "aws_s3_bucket_versioning" "bucket_versioning" {
  bucket = aws_s3_bucket.student_submissions_bucket.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "bucket_crypto" {
  bucket = aws_s3_bucket.student_submissions_bucket.id

  rule {
    apply_server_side_encryption_by_default {
      kms_master_key_id = aws_kms_key.s3_submissions_key.arn
      sse_algorithm     = "aws:kms"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "block_public" {
  bucket = aws_s3_bucket.student_submissions_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
