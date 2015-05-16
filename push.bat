echo Adding files to commit
git add --all

echo Creating commit
git commit -m %1

echo Pushing to the git master branch
git push origin master
