# Kubernetes

## using helm

- monitoring statuses pod: `kubectl get pods -n able-dev -w`
- uninstall resource: `helm uninstall ricardo-kafka --namespace able-dev`
- creating resource (kafka w/o auth): `helm install: helm install ricardo-kafka bitnami/kafka --namespace able-dev --create-namespace --set listeners.client.protocol=PLAINTEXT****`
- applying modification in yml deployment file:` kubectl apply -f notification-deployment.yaml`


# Kafka installing
First, remove the cache and old versions of kafka if exists:

`helm uninstall kafka -n able-dev
kubectl delete pvc -l app.kubernetes.io/name=kafka -n able-dev`


`export CLUSTER_ID=$(uuidgen | base64 | tr -d '=+/[:space:]' | cut -c1-22)

`helm install kafka bitnami/kafka \
--namespace able-dev \
--set auth.enabled=false \
--set controller.replicaCount=2 \
--set controller.listeners.controller.protocol=PLAINTEXT \
--set controller.listeners.controller.port=9093 \
--set clusterId=$CLUSTER_ID \
--set advertisedListeners.client.name=CLIENT \
--set advertisedListeners.client.protocol=PLAINTEXT \
--set advertisedListeners.client.listenerPort=9092 \
--set advertisedListeners.client.advertisedHost=kafka \
--set advertisedListeners.client.advertisedPort=9092
`

