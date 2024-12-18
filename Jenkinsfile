pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'visualize'
        VERCEL_TOKEN = 'RdknDK1TJj9s8LXtNoFqQuRz'
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

        stage('Deploy to Vercel') {
            steps {
                script {
                    withCredentials([string(credentialsId: 'vercel-token', variable: 'VERCEL_TOKEN')]) {
                        sh 'npx vercel --prod --token $VERCEL_TOKEN'
                    }
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
