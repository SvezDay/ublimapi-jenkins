pipeline {
    agent any

    tools {nodejs "node"}


    environment {
      registry = "svezday/ublimapi"
      registryCredential = 'dockerhub'
    }

    stages {
        stage('Install dependencies') {
            steps {
              sh 'npm install'
            }
        }
        /*
        stage('Building image') {
            steps{
                script {
                  docker.build registry + ":$BUILD_NUMBER"
                }
            }
        }
        */
        stage('Test') {
            steps {
                echo 'Testing..'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying....'
            }
        }
    }
}
