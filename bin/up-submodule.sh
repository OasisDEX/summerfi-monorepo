cd armada-protocol/contracts
git checkout main
git pull origin main
commit_hash=$(git rev-parse HEAD)
cd ../..
git add armada-protocol/contracts
git commit -m "Update submodule to commit $commit_hash"
