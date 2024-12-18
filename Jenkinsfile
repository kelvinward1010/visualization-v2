pipeline {
    agent any

    tools {
        nodejs "node_20" // Setup in Tools of Manage Jenkins
        jdk "jdk"
        maven "maven3"
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

        // stage('Build Docker Image') {
        //     steps {
        //         script {
        //             docker.build("${DOCKER_IMAGE}:${env.BUILD_ID}").push()
        //         }
        //     }
        // }
    }

    post { 
        success { 
            echo "Deployment Successful"
        }  
        failure { 
            echo "Deployment Failed"
        }
    }
}
