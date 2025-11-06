import { ResponseFunction, Session } from "../models";

interface ApiFunctionOptions<M extends new (...args: any[]) => any = any, S extends new (...args: any[]) => any = any> {
	name: string;
	model: M;
	signature?: S;
}

declare module "../models/request" {
	interface RequestFunction<Data = any, Signature = undefined> {
		readonly decoder: ResponseFunction<any, any>;
	}
}

export function ApiFunction<
	M extends new (...args: any[]) => any,
	S extends new (...args: any[]) => any | undefined = undefined,
>(options: ApiFunctionOptions<M, S>): ClassDecorator {
	return function (target: Function) {
		const Original = target as any;

		const Decorated = class extends Original {
			public static readonly name = options.name;
			protected readonly decoder: ResponseFunction<
				InstanceType<M>,
				S extends new (...args: any[]) => any ? InstanceType<S> : undefined
			>;

			constructor(...args: any[]) {
				const [session] = args as [Session];
				super(session, options.name);

				this.decoder = new ResponseFunction(session, options.model, options.signature);
			}
		};

		return Decorated as unknown as typeof target;
	};
}
