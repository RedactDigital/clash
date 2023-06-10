# Start Clash of Clans

```bash
docker service create ghcr.io/redactdigital/clash-of-clans:latest \
        --secret DATADOG_API_KEY \
        --secret DATABASE_HOST \
        --secret DATABASE_USER \
        --secret DATABASE_PASSWORD \
        --secret DATABASE_PORT \
        --secret CLASH_OF_CLANS_DATABASE_NAME \
        --secret CLASH_OF_CLANS_API_KEY \
        --secret CLASH_OF_CLANS_DISCORD_TOKEN \
        --replicas 1 \
        --restart-condition on-failure \
        --update-parallelism 1 \
        --update-delay 10s
```
