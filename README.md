# MIA-2 Server

## Initial
- Clone into git repo
- Move out of root `sudo mv /root/projects/<git-folder> /var/www/`
- Ensure permissions
    ```
    sudo chown -R www-data:www-data /var/www/<git-folder>
    sudo chmod -R 755 /var/www/<git-folder>
    ``` 

## Reverse Proxy

### NGINX Setup
- Have domain
- Set A address as the VPS's IP address
- Wait 15 min
- Create an nginx config file with `sudo nano /etc/nginx/sites-available/<name>` and replace with:
    ```
    server {
        server_name <name>.xyz www.<name>.xyz;

        root /var/www/<git-folder>;
        index index.html

        location / {
            rewrite ^/([a-zA-Z0-9_-]+)$ /$1.html break;
            try_files $uri $uri.html $uri/ =404
        }
    }
    ```
- Link files with `sudo ln -s /etc/nginx/sites-available/<name> /etc/nginx/sites-enabled/`
- Validate config with `sudo nginx -t`
- Reload with `sudo systemctl reload nginx`

### HTTPS Setup
- Run this `sudo certbot --nginx -d <name>.xyz -d www.<name>.xyz`
- Check for cron job for auto reneew SSL cert with `sudo certbot renew --dry-run`

## Tasks

### To-Do
- [ ] If login clicked from landing then take to app
- [ ] Improve formatting to be more readable
- [ ] 

### Done
- [x] 