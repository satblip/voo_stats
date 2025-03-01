#!/usr/bin/env bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE USER voo_stats;
    CREATE DATABASE voo_stats;
    GRANT ALL PRIVILEGES ON DATABASE voo_stats TO voo_stats;

    \connect voo_stats


EOSQL
