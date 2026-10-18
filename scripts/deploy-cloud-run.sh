#!/usr/bin/env bash
set -euo pipefail

# DogHealthOS - Production Cloud Run Deployment Script
# Phase 5: Containerization, Docker & Cloud Run Deployment (Step 6.2)

SERVICE_NAME="${SERVICE_NAME:-doghealthos-prod}"
IMAGE_TAG="${IMAGE_TAG:-gcr.io/ai-studio-dogbreedlifeexpe/doghealthos:v1.0.0}"
REGION="${REGION:-us-east1}"
SECRET_REF="${SECRET_REF:-projects/28567500933/secrets/GEMINI_API_KEY:latest}"

echo "============================================================"
echo " Deploying DogHealthOS to Google Cloud Run (Production)"
echo " Service:       ${SERVICE_NAME}"
echo " Image:         ${IMAGE_TAG}"
echo " Region:        ${REGION}"
echo " Min Instances: 1 (Eliminates cold-start latency for urgent care)"
echo " Max Instances: 20"
echo " Memory / CPU:  1Gi / 1 vCPU"
echo " Concurrency:   80"
echo " Port:          3000"
echo "============================================================"

gcloud run deploy "${SERVICE_NAME}" \
  --image "${IMAGE_TAG}" \
  --platform managed \
  --region "${REGION}" \
  --allow-unauthenticated \
  --min-instances 1 \
  --max-instances 20 \
  --memory 1Gi \
  --cpu 1 \
  --timeout 60s \
  --concurrency 80 \
  --set-env-vars="NODE_ENV=production,PORT=3000" \
  --set-secrets="GEMINI_API_KEY=${SECRET_REF}"

echo "✅ Deployment initiated successfully."
