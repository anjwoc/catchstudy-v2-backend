FILE=/home/anjwoc/www/catchDev/back/docker/nginx/nginx.conf
if [ -f "$FILE" ]; then
	echo "$FILE exist"
	rm ./nginx.conf
	cp ~/etc/nginx/nginx.conf ~/www/catchDev/back/docker/nginx/
else
	cp ~/etc/nginx/nginx.conf ~/www/catchDev/back/docker/nginx/
fi

