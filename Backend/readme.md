
cd Newskillbackend_Production/
ls -lrt
docker -v
sudo chmod 777 ~/Newskillbackend_Production/Backend/mongo-db.sh 
~/Newskillbackend_Production/Backend/mongo-db.sh
update the IP in the .env file
docker build -t backend-docker .
docker run -d -p 5000:10000 --name newskill-backend-container backend-docker
docker ps -a



 