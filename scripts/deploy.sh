scp "./tmp/build.tar.gz" "root@bobrovartem.ru:/var/www/cats-ui/tmp/"
ssh "root@bobrovartem.ru" << EOF
    rm -fr /var/www/cats-ui/build/
    tar -zxvf /var/www/cats-ui/tmp/build.tar.gz /var/www/cats-ui/build
EOF
