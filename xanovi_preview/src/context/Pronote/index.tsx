import { createContext, ReactNode, useContext, useState } from "react";
import Xanovi from "./../../lib/xanovi_lib";
const pawnote = Xanovi.pronote;

interface PronoteContextType {
	instance?: InstanceType<typeof pawnote.Instance.fromURL.prototype>;
	portal?: InstanceType<typeof pawnote.LoginPortal>;
	auth?: InstanceType<typeof pawnote.PendingLogin>;
	user?: InstanceType<typeof pawnote.User>;
	admin?: InstanceType<typeof pawnote.StudentAdministration>;
	setPronoteData: (data: Partial<PronoteContextType>) => void;
}

const PronoteContext = createContext<PronoteContextType>({
	setPronoteData: () => {},
});

export const PronoteProvider = ({ children }: { children: ReactNode }) => {
	const [pronoteData, setPronoteDataState] = useState<Partial<PronoteContextType>>({});

	const setPronoteData = (data: Partial<PronoteContextType>) => {
		setPronoteDataState((prev) => ({ ...prev, ...data }));
	};

	return <PronoteContext.Provider value={{ ...pronoteData, setPronoteData }}>{children}</PronoteContext.Provider>;
};

export const usePronote = () => useContext(PronoteContext);
