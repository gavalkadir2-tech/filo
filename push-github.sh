#!/bin/bash
echo "============================================"
echo " FiloPro - GitHub Push Araci"
echo "============================================"
echo
read -p "GitHub token'ini yapistir ve Enter'a bas: " GITHUB_TOKEN

git remote remove origin 2>/dev/null
git remote add origin "https://gavalkadir2-tech:${GITHUB_TOKEN}@github.com/gavalkadir2-tech/filo.git"

git checkout -B main
git add -A
git commit -m "Initial commit" --allow-empty

git push -u origin main --force

echo
echo "============================================"
echo " Islem tamamlandi. Yukaridaki mesajlari kontrol et."
echo " Hata yoksa repo adresin: https://github.com/gavalkadir2-tech/filo"
echo "============================================"
