import React from 'react'
import axios from "axios"
import { debounce } from '../util.js'

interface ITestStates {
  inputValue: string
  qq: string
  name: string
  qlogo: string
  loading: boolean
  valueValid: boolean
}

class test extends React.Component<{}, ITestStates> {
  public inputRef = React.createRef<any>()
  constructor (props) {
    super(props)

    this.state = {
      inputValue: '',  // 输入的qq号码
      name: '', // 用户名
      qlogo: '', // 用户头像地址
      qq: '',
      loading: false,
      valueValid: false  // 校验输入的qq是否合法标记
    }

  }
  
  public reset = () => {
    this.setState({qq: '', name: '', qlogo: ''});
  }
  public change = (e) => { 
    const reg = /^[1-9]\d{4,10}$/; //  合法qq 以非0数字开头，长度好像只有5-11位的, 
    const {value} = e.target;
    this.reset();
    if(!!value.length){
      this.setState({valueValid: reg.test(value)});
      this.queryQQ(value)
    }
    this.setState({inputValue: value});
  }

  public queryQQ = debounce((value) => {
    // 查询qq 
    if(!this.state.valueValid)  return ;
    this.setState({loading: true})
    axios.get(`https://api.uomg.com/api/qq.info?qq=${value}`).then(
       ({data}) =>{
        this.setState({loading: false})
        if(data.code === 1){
          const {qq, name, qlogo} = data;
          this.setState({qq, name, qlogo}, () => this.inputRef.current.focus());
        }else{
          alert(data.msg);
        }
       },
      error => {
        this.setState({loading: false});
        alert("请求失败");
      }
     )
    }, 500)

  public render () {
    const {inputValue, qq, name, qlogo, loading, valueValid} = this.state;
    return (
      <div className='container'>
        <div><h2 className='qq-title'>QQ号查询</h2></div>
        <div className='qq-content'>
          <label className='qq-label'>QQ</label>
          <input className='qq-input' ref={this.inputRef} disabled={loading} value={inputValue} onChange={this.change} />
          {!!inputValue && <div className={valueValid ? 'success' : 'error'}></div>}
        </div>
        {loading && <div className='loading'></div> }
        {!!inputValue && !valueValid && <div>请输入5-11位纯数字</div>}
        {!!qlogo && 
        <div className='qq-info'>
          <img src={qlogo} className='qq-img' alt="头像" />
          <div className='qq-info-content'>
            <div className='qq-info-name' title={name}>{name}</div>
            <div>{qq}</div>
          </div>
        </div>}
    </div>
    )
  }
}

export default test
