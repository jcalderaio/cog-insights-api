variable lambda_version {
  default = "LATEST"
}

# NOTE: There is a terraform.tfvars file in S3 that Jenkins will use. Passwords should not be under revision control.
variable app_config {
  type = "map"

  default = {
    dev = {
      "LAMBDA_ALIAS" = "dev"
      "DB_HOST"      = "esante-dev.cvjgxrxnvk8i.us-east-1.rds.amazonaws.com"
      "DB_PORT"      = 5432
      "DB_DATABASE"  = "insights"
      "DB_USER"      = "xxxxxxx"
      "DB_PASSWORD"  = "xxxxxxx"

      "WSO2_DB_HOST"     = "esante-dev.cvjgxrxnvk8i.us-east-1.rds.amazonaws.com"
      "WSO2_DB_PORT"     = 3306
      "WSO2_DB_DATABASE" = "isdb"
      "WSO2_DB_USER"     = "xxxxxxx"
      "WSO2_DB_PASSWORD" = "xxxxxxx"

      "HS_HOST"               = "10.201.1.138"
      "HS_PORT"               = "1972"
      "HS_BASE_URL"           = "http://healthshare.dev.cognosante.cc:57772"
      "HS_USERNAME"           = "xxxxxxx"
      "HS_PASSWORD"           = "xxxxxxx"
      "HS_REGISTRY_NAMESPACE" = "HSREGISTRY"

      "HEDIS_API_URL" = "xxxxx.execute-api.us-east-1.amazonaws.com/dev/graphql"
      "MIPS_API_URL"  = "xxxxx.execute-api.us-east-1.amazonaws.com/dev/graphql"
    }

    qa = {
      "DB_HOST"     = "esante-qa.cvjgxrxnvk8i.us-east-1.rds.amazonaws.com"
      "DB_PORT"     = 5432
      "DB_DATABASE" = "insights"
      "DB_USER"     = "xxxxxxx"
      "DB_PASSWORD" = "xxxxxxx"

      "WSO2_DB_HOST"     = "esante-dev.cvjgxrxnvk8i.us-east-1.rds.amazonaws.com"
      "WSO2_DB_PORT"     = 3306
      "WSO2_DB_DATABASE" = "isdb"
      "WSO2_DB_USER"     = "xxxxxxx"
      "WSO2_DB_PASSWORD" = "xxxxxxx"

      "HS_HOST"               = "10.201.1.57"
      "HS_PORT"               = "1972"
      "HS_BASE_URL"           = "http://healthshare.dev.cognosante.cc:57772"
      "HS_USERNAME"           = "xxxxxxx"
      "HS_PASSWORD"           = "xxxxxxx"
      "HS_REGISTRY_NAMESPACE" = "HSREGISTRY"

      "HEDIS_API_URL" = "xxxxx.execute-api.us-east-1.amazonaws.com/qa/graphql"
      "MIPS_API_URL"  = "xxxxx.execute-api.us-east-1.amazonaws.com/qa/graphql"
    }

    stage = {
      "DB_HOST"     = "esante-stage.cvjgxrxnvk8i.us-east-1.rds.amazonaws.com"
      "DB_PORT"     = 5432
      "DB_DATABASE" = "insights"
      "DB_USER"     = "xxxxxxx"
      "DB_PASSWORD" = "xxxxxxx"

      "WSO2_DB_HOST"     = "esante-dev.cvjgxrxnvk8i.us-east-1.rds.amazonaws.com"
      "WSO2_DB_PORT"     = 3306
      "WSO2_DB_DATABASE" = "isdb"
      "WSO2_DB_USER"     = "xxxxxxx"
      "WSO2_DB_PASSWORD" = "xxxxxxx"

      "HS_HOST"               = "10.201.1.71"
      "HS_PORT"               = "1972"
      "HS_BASE_URL"           = "http://healthshare.dev.cognosante.cc:57772"
      "HS_USERNAME"           = "xxxxxxx"
      "HS_PASSWORD"           = "xxxxxxx"
      "HS_REGISTRY_NAMESPACE" = "HSREGISTRY"

      "HEDIS_API_URL" = "xxxxx.execute-api.us-east-1.amazonaws.com/stage/graphql"
      "MIPS_API_URL"  = "xxxxx.execute-api.us-east-1.amazonaws.com/stage/graphql"
    }
  }
}
