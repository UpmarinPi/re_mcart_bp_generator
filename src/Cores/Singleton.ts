export abstract class Singleton {
    private static instance: Singleton;

    public static get<T extends typeof Singleton>(this: T): InstanceType<T> {
        if (!(this as any).instance) {
            (this as any).instance = new (this as any)();
        }
        return (this as any).instance as InstanceType<T>;
    }
}