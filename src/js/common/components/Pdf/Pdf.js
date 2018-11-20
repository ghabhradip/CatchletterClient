import React,{Component} from 'react';

class Pdf extends Component{
    render(){
        return(
            <div>
                <div className="top-bar-row py-5">
                    <div className="container">
                        <div class="d-flex justify-content-between website"><h1 class="heading-font mb-3">Receipt generate</h1><button type="button" class="btn btn-primary website-btn"><i class="fa fa-download"></i> Download PDF</button></div>
                       <div className="card mt-3">
                       <div id="testContainer" style={{width:'794px', height:'auto', margin:'auto' , fontFamily:'arial', padding:'15px'}}>
                            <h1 style={{fontFamily:'arial',fontWeight: 'bold', fontSize:'28px',display:'block',  textAlign:'center', borderBottom:'1px solid #ddd', paddingBottom:'15px',paddingTop:'30px'}} >Receipt for March 2017</h1>
                            
                            <ul style={{padding:'0px', listStyle:'none',color:'#5c5a5a', fontSize:'14px', lineHeight:'20px',marginTop:'20px' }}>
                                <li><h3 style={{fontSize:'20px', marginBottom:'5px',fontWeight:'bold'}} >Customer Information</h3></li>
                                <li>Jhon Doe</li>
                                <li>6 East Pleasant Court Hyde Park, MA 02136 , US</li>
                                <li>+5446464654</li>
                                <li>West Bengal</li>
                            </ul>
                            <table width="100%" style={{border:'1px solid #ddd' , borderCollapse:'collapse', marginTop:'20px'}}>
                            <tr style={{borderBottom:'1px solid #ddd', color:'#5c5a5a', fontSize:'16px'}}>
                                <th style={{textAlign:'left', padding:'10px'}}>Description</th>
                                <th style={{textAlign:'center',padding:10}}>Date</th>
                                <th style={{textAlign:'right', padding:'10px'}}>Amount</th>
                            </tr>
                            <tr style={{borderBottom:'1px solid #ddd', color:'#5c5a5a', fontSize:'14px'}}>
                                <td style={{textAlign:'left', padding:'10px'}}>Specifies the alignment of a table according to surrounding text</td>
                                <td style={{textAlign:'center', padding:'10px'}}>12 july 2018</td>
                                <td style={{textAlign:'right', padding:'10px'}}>$50</td>
                            </tr>
                            <tr style={{borderBottom:'1px solid #ddd', color:'#5c5a5a', fontSize:'14px'}}>
                                <td style={{textAlign:'left', padding:'10px'}}>Specifies the alignment of a table according to surrounding text</td>
                                <td style={{textAlign:'center', padding:'10px'}}>12 july 2018</td>
                                <td style={{textAlign:'right', padding:'10px'}}>$50</td>
                            </tr>
                            <tr style={{borderBottom:'1px solid #ddd', color:'#5c5a5a', fontSize:'14px'}}>
                                <td style={{textAlign:'left', padding:'10px'}}>Specifies the alignment of a table according to surrounding text</td>
                                <td style={{textAlign:'center', padding:'10px'}}>12 july 2018</td>
                                <td style={{textAlign:'right', padding:'10px'}}>$50</td>
                            </tr>
                            <tr style={{borderBottom:'1px solid #ddd', color:'#5c5a5a', fontSize:'14px',backgroundColor:'#f2f4f4',fontWeight:'600'}}>
                                <td colSpan="2" style={{textAlign:'left', padding:'10px'}}>Sub Total</td>
                                <td style={{textAlign:'right', padding:'10px'}}>$50</td>
                            </tr>
                            <tr style={{borderBottom:'1px solid #ddd', color:'#5c5a5a', fontSize:'14px',backgroundColor:'#f2f4f4',fontWeight:'600'}}>
                                <td colSpan="2" style={{textAlign:'left', padding:'10px'}}>Discount</td>
                                <td style={{textAlign:'right', padding:'10px'}}>$50</td>
                            </tr>
                            <tr style={{borderBottom:'1px solid #ddd', color:'#5c5a5a', fontSize:'14px',backgroundColor:'#f2f4f4',fontWeight:'600'}}>
                                <td colSpan="2" style={{textAlign:'left', padding:'10px'}}>Tax</td>
                                <td style={{textAlign:'right', padding:'10px'}}>$50</td>
                            </tr>
                            <tr style={{borderBottom:'1px solid #ddd', color:'#5c5a5a', fontSize:'15px',backgroundColor:'#dddede',fontWeight:'600'}}>
                                <td colSpan="2" style={{textAlign:'left', padding:'10px'}}>Total</td>
                                <td style={{textAlign:'right', padding:'10px'}}>$50</td>
                            </tr>
                            </table>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Pdf;