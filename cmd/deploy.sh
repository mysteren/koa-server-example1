#!/bin/bash
rsync -avz --delete --exclude='node_modules/*' --exclude='config/local.js' ./* timofey@91.109.206.101:/var/www/dordoc/api
ssh timofey@91.109.206.101 'cd /var/www/dordoc/api && npm ic --production && sudo /bin/systemctl restart dordoc-api.service'
