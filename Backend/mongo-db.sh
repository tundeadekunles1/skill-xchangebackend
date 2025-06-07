# pull mongo from the official mongo db image
docker pull mongo


# Example command
# docker run -d --network some-network --name some-mongo \
# 	-e MONGO_INITDB_ROOT_USERNAME=mongoadmin \
# 	-e MONGO_INITDB_ROOT_PASSWORD=secret \
# 	mongo

# change the MONGO_INITDB_ROOT_USERNAME & MONGO_INITDB_ROOT_PASSWORD values or pass it with ENV
docker run -d -p 27017:27017 --name mongo-db \
	-e MONGO_INITDB_ROOT_USERNAME=mongoadmin \
	-e MONGO_INITDB_ROOT_PASSWORD=secret \
	mongo

# note: connection string for docker mongo database should target VM private or public IP / DNS