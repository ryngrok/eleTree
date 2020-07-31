import { paramDetection, getNodeDataById, updateDate, isArray } from '~/opera/tools'
import reloadVnode from '~/vnode/reloadVnode'
import { symbolAttr } from '~/config'
/**
 * 插入节点
 * @param {*查找节点id，传null或空字符串则会添加到根节点} id 
 * @param {*添加的子节点数据} data 
 * @param {*插入节点位置(before,after)} type 
 */
export default function(methods, id, data = [], type = 'before') {
    let options = this.config
    let {name, key, isOpen, checked, children, disabled, isLeaf } = options.request

    if(paramDetection(id, 'String|Number', 'insertAfter方法第一个参数必须为String|Number')) return methods
    if(paramDetection(data, 'Array|Object', 'insertAfter方法第二个参数必须为Array|Object')) return methods

    data = isArray(data) ? data : [data]
    let cData = getNodeDataById.call(this, id)
    // 没找到
    if(!cData) return methods
    let pData = cData[symbolAttr.parentNode]
    // 根节点判断
    if(!pData){
        let index = options.data.findIndex(v=>v[key]===id)
        index = type === 'before' 
            ? index
            : type === 'after' 
                ? index + 1
                : index
        options.data.splice(index, 0, ...data)
        updateDate.call(this)
    }else{
        let index = pData[children].findIndex(v=>v[key]===id)
        index = type === 'before' 
            ? index
            : type === 'after' 
                ? index + 1
                : index
        pData[children].splice(index, 0, ...data)
        updateDate.call(this, cData)
    }
    reloadVnode.call(this)
    return methods
}