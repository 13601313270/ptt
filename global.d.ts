// 声明Window对象中的Tracker对象；常用于给Window添加方法或属性
interface Window {
  pttSend: (str: string) => void,
  lastReciveData: string[][],
}