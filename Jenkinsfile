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
