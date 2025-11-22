import { HeaderKeys, HttpRequest, send } from "schwi";
import { deserialize } from "~d0/deserialize";
import { deserializeWith, rename, t, u } from "~d0/index";
import { UA } from "../core/user-agent";
import { Version } from "./version";
import { Webspace } from "./webspace";

export class InstanceInformation {
	@rename("nomEtab")
	public name = t.string();

	public version = t.array(t.number()) as Version;

	@deserializeWith((date: string) => new Date(date))
	public date = t.instance<Date>();

	@rename("espaces")
	public webspaces = t.array(t.reference(InstanceInformationWebspace));

	@rename("CAS")
	public cas = t.option(t.reference(InstanceInformationCAS));
}

export class InstanceInformationWebspace {
	@rename("nom")
	public name = t.string();

	@rename("URL")
	public path = t.string();

	@rename("genreEspace")
	public kind = t.enum(Webspace);
}

export class InstanceInformationCAS {
	@rename("actif")
	public active = t.boolean();

	@rename("casURL")
	@deserializeWith(u.falsyToNull)
	public url = t.option(t.string());

	@rename("jetonCAS")
	public token = t.option(t.string());
}

export class Instance {
	public readonly base: string;

	private constructor(base: string | URL) {
		if (!(base instanceof URL)) base = new URL(base);
		this.base = this.clean(base);
	}

	private clean(base: URL) {
		base = new URL(`${base.protocol}//${base.host}${base.pathname}`);

		const paths = base.pathname.split("/");
		if (paths[paths.length - 1].includes(".html")) {
			paths.pop();
		}

		base.pathname = paths.join("/");

		return base.href.endsWith("/") ? base.href.slice(0, -1) : base.href;
	}

	public static fromURL(url: string | URL): Instance {
		return new this(url);
	}

	public async getInformation(): Promise<InstanceInformation> {
		const request = new HttpRequest.Builder(`${this.base}/infoMobileApp.json`)
			.setUrlSearchParameter("id", "0D264427-EEFC-4810-A9E9-346942A862A4")
			.setHeader(HeaderKeys.USER_AGENT, UA)
			.build();

		const response = await send(request);
		const json = await response.toJSON();

		return deserialize(InstanceInformation, json);
	}
}
