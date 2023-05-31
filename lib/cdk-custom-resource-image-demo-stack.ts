import {
  Stack,
  StackProps,
  custom_resources as cr,
  aws_lambda as lambda,
  aws_ecr as ecr,
  CustomResource,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkCustomResourceImageDemoStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const repo = ecr.Repository.fromRepositoryName(this, 'PublicPullThrough', 'ecr-public/h8t8t4y6/ecrpublicstack-repo-q7s9eqxa0udf');
    const onEventHandler = new lambda.Function(this, 'Handler', {
      code: lambda.Code.fromEcrImage(repo, {
        tagOrDigest: 'sha256:09f2b287ec42530101c6261e7262745fa524d31313867146afe89407d546147d',
      }),
      handler: lambda.Handler.FROM_IMAGE,
      runtime: lambda.Runtime.FROM_IMAGE,
    });
    const provider = new cr.Provider(this, 'Provider', {
      onEventHandler,
    });
    new CustomResource(this, 'CR', {
      serviceToken: provider.serviceToken,
      resourceType: 'Custom::LambdaImageCR',
    });
  }
}

export class ECRPublic extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    new ecr.CfnPublicRepository(this, 'Repo', {
      repositoryCatalogData: {
        UsageText: 'ECR public repo usage text',
        AboutText: 'this is some about text',
        OperatingSystems: ['Linux'],
        Architectures: [
          'x86', 'ARM',
        ],
      },
      repositoryPolicyText: {
        Version: '2008-10-17',
        Statement: [{
          Sid: 'Public repo policy',
          Effect: 'Allow',
          Principal: {
            AWS: `arn:aws:iam::${this.account}:root`,
          },
          Action: [
            'ecr-public:*',
          ],
        }]
      },
    });
    new ecr.CfnPullThroughCacheRule(this, 'PullThroughCache', {
      ecrRepositoryPrefix: 'ecr-public',
      upstreamRegistryUrl: 'public.ecr.aws',
    });
  }
}
