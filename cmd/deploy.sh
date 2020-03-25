#!/bin/bash
rsync -avz --delete --exclude='*node_modules/*' ./* timofey@91.109.206.101:/var/www/dordoc/api
ssh timofey@91.109.206.101 'cd /var/www/dordoc/api && npm ic --production && sudo systemctl restart dordoc-api.service'