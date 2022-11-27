export default class Utils {

    public static async waitUntil(milliseconds: number) {
        return await new Promise(resolve => {
            setInterval(() => {
                resolve('');
            }, milliseconds);
        });
    }


    public static random(min: number, max: number): number {
        return Math.floor(
            Math.random() * (max - min) + min
        );
    }
}