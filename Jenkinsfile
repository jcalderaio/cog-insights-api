#!/usr/bin/env groovy

pipeline {
  environment {
    WEBHOOK_URL = "https://outlook.office.com/webhook/3ed82dea-88cf-41b4-a0c8-461614a6014a@e23c73d3-075d-42c8-a4fc-bcc0fcd1b8ad/IncomingWebhook/7ee775b701444fba87a5e60fe1b7a05c/538444a8-756a-4acb-be56-c961dfb58527"
		APP_NAME = "esante-insights-api"
    LAMBDA_FUNCTION_NAME = "arn:aws:lambda:us-east-1:056522482037:function:esante-insights-api"
    ARTIFACTS_BUCKET = "cgs-artifacts"
		ARTIFACTS_PATH = "esante/insights/esante-insights-api/"
    BUILD ="./dist"
  }

  agent none

  stages {
    stage('Build') {
      agent any
      steps {
        milestone 1
        sh 'rm -rf ./node_modules  package-lock.json'
        sh "echo '//registry.npmjs.org/:_authToken=$NPM_TOKEN' > .npmrc"
        sh 'npm install'
        sh "npm run lint"
        sh "npm test"
        // update package.json with commit
        script {
          def commit_id = sh (script: 'git rev-parse --short HEAD', returnStdout: true).trim();
          def timestamp = sh (script: 'date +"%Y%m%d_%H%M%S"', returnStdout: true).trim();
          echo "Build:  number:$BUILD_NUMBER   id:$BUILD_ID"
          sh "sed -i 's/00000/$BUILD_NUMBER/' ./package.json"
          sh "sed -i 's/99999/$commit_id/' ./package.json"
          sh "npm run build"
          def artifact_name = "$APP_NAME.${timestamp}.${commit_id}.zip"
          sh "aws s3 cp $BUILD/lambda.zip s3://${ARTIFACTS_BUCKET}/${ARTIFACTS_PATH}${artifact_name} --no-progress"
          echo "========= $BUILD_NUMBER ===> ${ARTIFACTS_PATH}${artifact_name}"

          // get version and build number, put in publish_version.txt for future step that tags release in github
          def npmVersion = sh (script: 'cat ./package.json | jq ".version"', returnStdout: true).trim().replace("\"","");
          // def publishVersion = "${npmVersion}+${BUILD_NUMBER}";
          // build number was already added to package.json in this case.
          def publishVersion = "${npmVersion}";
          sh "echo ${publishVersion} > publish_version.txt"
          stash includes: 'publish_version.txt', name: 'publish_version'

          sh "echo ${ARTIFACTS_PATH}${artifact_name} > artifact"
          sh "cat ./artifact"
          stash includes: 'artifact', name: 'artifact'
        }
        echo "Build Completed"
      }
    }

    stage('Deploy to DEV') {
      agent any
      steps {
        milestone 2
        script {
          unstash 'artifact'
          def artifact = readFile('artifact').trim()
          sh "aws s3 cp s3://cgs-software/terraform/install.sh  ./terraform_install.sh --no-progress && sh terraform_install.sh ./ && chmod +x ./terraform"

          // copy tfvars with sensitive credentials
          sh "aws s3 cp s3://cgs-insights/terraform-vars/${APP_NAME}/terraform.tfvars  ./terraform.tfvars"

          stash includes: 'terraform', name: 'terraform'
          sshagent(["${SSH_AGENT_CREDENTIALS}"]) {
            sh "rm -rf .terraform && ./terraform init ./infrastructure/common"
            sh "./terraform apply -no-color -auto-approve -var 'lambda_s3_key=${artifact}' ./infrastructure/common"
            sh "cd ./infrastructure/common && rm -rf .terraform && ../../terraform init  && ../../terraform output lambda_version > ../../lambda_version"
          }
          stash includes: 'lambda_version', name: 'lambda_version'

          // deploying to DEV
          def env = "dev"
          def lambda_version = readFile('lambda_version').trim()

          echo "Deploying lambda version ${lambda_version} to ${env} [${artifact}]"
          sshagent(["${SSH_AGENT_CREDENTIALS}"]) {
            sh "rm -rf .terraform && ./terraform init ./infrastructure/environment"
            sh "./terraform workspace select ${env} ./infrastructure/environment || ./terraform workspace new ${env} ./infrastructure/environment"
            sh "./terraform apply -no-color -auto-approve -var 'lambda_s3_key=${artifact}' -var 'lambda_version=${lambda_version}' ./infrastructure/environment"
          }
          echo "Deploy to [${env}] completed"
        }
      }
    }

    stage('Confirm Deploy to QA') {
      agent none
      steps {
        timeout(time: 12, unit: 'HOURS') {
          input 'Deploy to QA?'
        }
      }
    }

    stage('Tag build in Git'){
      agent any
      steps {
        milestone 3
        unstash 'publish_version'
        script {
          def publishVersion = readFile('publish_version.txt').trim();
          sh "git tag ${publishVersion}"
          sshagent(["${SSH_AGENT_CREDENTIALS}"]) {
            sh "git push origin ${publishVersion}"
          }
        }
      }
    }

    stage('Deploy to QA') {
      agent any
      steps {
        milestone 4
        script {
          def env = "qa"
          unstash 'artifact'
          def artifact = readFile('artifact').trim()
          unstash 'lambda_version'
          def lambda_version = readFile('lambda_version').trim()
          echo "Deploying lambda version ${lambda_version} to ${env}"
          unstash 'terraform'
          sshagent(["${SSH_AGENT_CREDENTIALS}"]) {
            sh "rm -rf .terraform && ./terraform init ./infrastructure/environment"
            sh "./terraform workspace select ${env} ./infrastructure/environment || ./terraform workspace new ${env} ./infrastructure/environment"
            sh "./terraform apply -no-color -auto-approve -var 'lambda_s3_key=${artifact}' -var 'lambda_version=${lambda_version}' ./infrastructure/environment"
          }
          echo "Deploy to [${env}] completed"
        }
      }
    }


    stage('Confirm STAGE') {
      agent none
      steps {
        timeout(time: 12, unit: 'HOURS') {
          input 'Deploy to STAGE?'
        }
      }
    }

    stage('Deploy to STAGE') {
      agent any
      steps {
        milestone 5
        script {
          def env = "stage"
          unstash 'artifact'
          def artifact = readFile('artifact').trim()
          unstash 'lambda_version'
          def lambda_version = readFile('lambda_version').trim()
          echo "Deploying lambda version ${lambda_version} to ${env}"
          unstash 'terraform'
          sshagent(["${SSH_AGENT_CREDENTIALS}"]) {
            sh "rm -rf .terraform && ./terraform init ./infrastructure/environment"
            sh "./terraform workspace select ${env} ./infrastructure/environment || ./terraform workspace new ${env} ./infrastructure/environment"
            sh "./terraform apply -no-color -auto-approve -var 'lambda_s3_key=${artifact}' -var 'lambda_version=${lambda_version}' ./infrastructure/environment"
          }
          echo "Deploy to [${env}] completed"
        }
      }
    }
  }
}
