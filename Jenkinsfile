pipeline {
    agent any

    tools {
        nodejs: "nodejs"
    }

    environment {
        DOCKER_IMAGE = 'kelvinward1010/visualize'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/kelvinward1010/visualization-v2.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${DOCKER_IMAGE}:${env.BUILD_ID}").push()
                }
            }
        }
    }

    post {
        success {
            slackSend channel: '#your-channel', color: 'good', message: "Deployment successful for build ${env.BUILD_ID}."
        }
        failure {
            slackSend channel: '#your-channel', color: 'danger', message: "Deployment failed for build ${env.BUILD_ID}."
        }
    }
}
