export type Observer<T> = T extends void ? () => void : (value: T) => void;

export class ObserverSubject<T = void>{
    private observers: Observer<T>[] = [];

    // 登録
    Subscribe(observer: Observer<T>) {
        this.observers.push(observer);
    }

    // 通知
    notify(...args: [T]){
        this.observers.forEach(observer => (observer as any)(...args));
    }
}
