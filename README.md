    4  cd Newskillbackend_Production/
    5  ls -lrt
    6  cd Backend/
    7  ls -lrt
    8  docker -v
    9  touch Dockerfile
   10  docker build -t backend-docker .
   11  docker run --name backend-docker -d -p 3000:5000 backend-docker
   12  docker ps
   13  docker images
   14  docker list -a
   15  docker ps -a
   16  docker logs dfe08612adce
   17  touch .env
   18  docker rmi dfe08612adce
   19  docker rmi backend-docker
   20  docker stop dfe08612adce
   21  docker rm dfe08612adce
   22  docker images
   23  docker rmi backend-docker
   24  docker run --name backend-docker -d -p 5000:10000 backend-docker
   25  docker build -t backend-docker .
   26  docker run --name backend-docker -d -p 5000:10000 backend-docker
   27  docker ps -a
   28  docker images
   29  docker logs ebd5c039ddd8
   30  docker stop ebd5c039ddd8
   31  docker rmi backend-docker
   32  docker rmi 507c93a24f5e
   33  docker rm ebd5c039ddd8
   34  docker rmi 507c93a24f5e
   35  clear
   36  docker build -t backend-docker .
   37  docker run --name backend-docker -d -p 5000:10000 backend-docker
   38  docker ps
   39  docker images
   40  docker ps -a
   41  docker logs fe320f94a3db
   42  docker exec -it fe320f94a3db printenv | grep MONGODB_URI
   43  docker run --env-file .env backend-docker
   44  docker stop fe320f94a3db
   45  docker rm fe320f94a3db
   46  docker rmi backend-docker
   47  docker rmi 146e6d8a012c
   48  docker images
   49  docker rmi 146e6d8a012c
   50  docker rm 5351f68f690b
   51  docker images
   52  docker rm 146e6d8a012c
   53  docker rmi 146e6d8a012c
   54  docker build -t backend-docker .
   55  docker run --env-file .env backend-docker
   56  docker ps -a
   57  docker images
   58  docker ps -a
   59  docker logs e3bd5a32c626
   60  sudo systemctl status mongod
   61  mongo --host 127.0.0.1 --port 27017
   62  curl 35.183.180.215:27017
   63  touch mongo-db.sh
   64  sudo chmod 777 mongo-db.sh
   65  ./mongo-db.sh
   66  docker ps -a
   67  docker stop e3bd5a32c626
   68  docker rm e3bd5a32c626
   69  docker images
   70  docker rmi 95f22ecec35c
   71  docker build -t backend-docker .
   72  docker run --env-file .env backend-docker
   73  docker ps
   74  docker image
   75  docker images
   76  docker logs 2693ada0910e
   77  docker logs a91c2cb0864b
   78  docker run --env-file .env backend-docker
   79  sudo chmod 777 mongo-db.sh
   80  docker run --env-file .env backend-docker
   81  docker ps
   82  docker rm a91c2cb0864b
   83  docker stop a91c2cb0864b
   84  docker rm a91c2cb0864b
   85  docker images
   86  docker rmi 2693ada0910e a7c5f35e6c6d 
   87  docker images
   88  docker rmi 2693ada0910e
   89  docker stop 2693ada0910e
   90  docker ps
   91  docker rmi 2693ada0910e
   92  docker rm 2693ada0910e
   93  docker rmi 2693ada0910e
   94  docker ps -a
   95  docker stop c5179af8b40f 07521f947b7e
   96  docker stop a501b059f631
   97  docker rm c5179af8b40f 07521f947b7e a501b059f631
   98  docker images
   99  docker rmi 2693ada0910e
  100  sudo chmod 777 mongo-db.sh
  101  ./mongo-db.sh
  102  docker build -t backend-docker .
  103  docker run --env-file .env backend-docker
  104  docker ps -a
  105  git remote -v
  106  git branch
  107  git checkout newskill
  108  git fetch origin
  109  git branch -r
  110  git checkout newskill
  111  git checkout -b newskill
  112  git add .
  113  git commit -m "commit to docker"
  114  git config --global --edit
  115  git push -u origin newskill
