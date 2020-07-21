import { readFileSync } from 'fs';
import { yamlParse } from 'yaml-cfn';
import * as t from 'io-ts';
import { either } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';

const ServerlessFunction = t.type({
    Type: t.literal('AWS::Serverless::Function'),
    Properties: t.type({
        Runtime: t.string,
        Handler: t.string,
        CodeUri: t.string,
    }),
});
export type ServerlessFunctionTemplate = t.TypeOf<typeof ServerlessFunction>;

const CloudFormationSchema = t.intersection([
    // optional properties
    t.partial({
        Globals: t.partial({
            Function: t.partial({
                Runtime: t.string,
            }),
        }),
    }),
    t.type({
        Resources: t.record(
            t.string,
            t.union([
                ServerlessFunction,
                t.type({
                    Type: t.string,
                }),
            ])
        ),
    }),
]);
export type CloudFormationTemplate = t.TypeOf<typeof CloudFormationSchema>;

export function getTemplate(templatePath: string): CloudFormationTemplate {
    const parseResult = pipe(
        either.tryCatch(
            () => yamlParse(readFileSync(templatePath).toString()),
            // ignore validation errors for now (TODO: nicer errors)
            () => []
        ),
        either.chain(CloudFormationSchema.decode)
    );

    if (either.isLeft(parseResult)) {
        console.log(parseResult.left.map((e) => e.context));
        throw new Error('Unable to parse yaml');
    }
    return parseResult.right;
}
