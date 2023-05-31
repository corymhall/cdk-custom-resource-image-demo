FROM public.ecr.aws/lambda/nodejs:18 as builder
WORKDIR /usr/app
COPY index.ts ./index.ts
RUN npm install -g esbuild
RUN esbuild index.ts --bundle --minify --platform=node --target=es2020 --outfile=dist/index.js

FROM public.ecr.aws/lambda/nodejs:18
WORKDIR ${LAMBDA_TASK_ROOT}
COPY --from=builder /usr/app/dist/* ./
CMD ["index.handler"]
