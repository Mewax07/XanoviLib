type Node<T> = [task: Task<T>, ok: (value: PromiseLike<T> | T) => void, err: (reason?: any) => void];
type Task<T> = () => Promise<T>;

export class AsyncQueue {
	private _nodes: Array<Node<any>> = [];
	private _pending = false;

	public run<T>(task: Task<T>): Promise<T> {
		return new Promise<T>((ok, err) => {
			this._nodes.push([task, ok, err]);
			if (!this._pending) this._dequeue();
		});
	}

	private _dequeue(): void {
		if (!this._pending) {
			const node = this._nodes.shift();

			if (node) {
				this._pending = true;

				node[0]().then(node[1]).catch(node[2]).finally(this._next);
			}
		}
	}

	private _next = (): void => {
		this._pending = false;
		this._dequeue();
	};
}
