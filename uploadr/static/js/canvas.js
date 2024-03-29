(function (){

/*逻辑部分*/
const c=document.getElementById("myCanvas");
const ctx=c.getContext("2d");
const scaleStep=1.05;
const minWidth=1180,minHeight=800,maxWidth=9000,maxHeight=7000;
const img=document.createElement('img');
const elementWidth=1180,elementHeight=800;
let startx,//起始x坐标
    starty,//起始y坐标
    flag,//是否点击鼠标的标志
    x,
    y,
    leftDistance,
    topDistance,
    op=0,//op操作类型 0 无操作 1 画矩形框 2 拖动矩形框
    scale=1,
	type=0;
let layers=[];//图层
let currentR;//当前点击的矩形框
img.src='png';
img.onload=function(){
    c.style.backgroundImage="url("+img.src+")";
    c.style.backgroundSize=`${c.width}px ${c.height}px`;
}
document.querySelector('#up').onclick=function(){
	if(c.width<=maxWidth&&c.height<=maxHeight){
		c.width*=scaleStep;
		c.height*=scaleStep;
		scale=c.height/minHeight;
		ctx.scale(scale,scale)
		c.style.backgroundSize=`${c.width}px ${c.height}px`;
		reshow()
	}
}
document.querySelector('#down').onclick=function(){
	if(c.width>=minWidth&&c.height>=minHeight){
		c.width/=scaleStep;
		c.height/=scaleStep;
		scale=c.height/minHeight;
		ctx.scale(scale,scale);
        c.style.backgroundSize=`${c.width}px ${c.height}px`;
		reshow();
	}

}
document.querySelector('#cancel').onclick=function(){
    layers.pop();
	ctx.clearRect(0,0,elementWidth,elementHeight);
    reshow();
}
document.querySelector('#clear').onclick=function(){
    layers=[];
	ctx.clearRect(0,0,elementWidth,elementHeight);
    reshow();
}
function resizeLeft(rect){
    c.style.cursor="w-resize";
    if(flag&&op==0){op=3;}
    if(flag&&op==3){
        if(!currentR){currentR=rect}
        currentR.x1=x
        currentR.width=currentR.x2-currentR.x1
    }
}
function resizeTop(rect){
    c.style.cursor="s-resize";
    if(flag&&op==0){op=4;}
    if(flag&&op==4){
        if(!currentR){currentR=rect}
        currentR.y1=y
        currentR.height=currentR.y2-currentR.y1
    }
}
function resizeWidth(rect){
    c.style.cursor="w-resize";
    if(flag&&op==0){op=5;}
    if(flag&&op==5){
        if(!currentR){currentR=rect}
        currentR.x2=x
        currentR.width=currentR.x2-currentR.x1
    }
}
function resizeHeight(rect){
    c.style.cursor="s-resize";
    if(flag&&op==0){op=6;}
    if(flag&&op==6){
        if(!currentR){currentR=rect}
        currentR.y2=y
        currentR.height=currentR.y2-currentR.y1
    }
}
function resizeLT(rect){
    c.style.cursor="se-resize";
    if(flag&&op==0){op=7;}
    if(flag&&op==7){
        if(!currentR){currentR=rect}
        currentR.x1=x
        currentR.y1=y
        currentR.height=currentR.y2-currentR.y1
		currentR.width=currentR.x2-currentR.x1
    }
}
function resizeWH(rect){
    c.style.cursor="se-resize";
    if(flag&&op==0){op=8;}
    if(flag&&op==8){
        if(!currentR){currentR=rect}
		currentR.x2=x
        currentR.y2=y
        currentR.height=currentR.y2-currentR.y1
		currentR.width=currentR.x2-currentR.x1
    }
}
function resizeLH(rect){
    c.style.cursor="ne-resize";
    if(flag&&op==0){op=9;}
    if(flag&&op==9){
        if(!currentR){currentR=rect}
		currentR.x1=x
        currentR.y2=y
        currentR.height=currentR.y2-currentR.y1
		currentR.width=currentR.x2-currentR.x1
    }
}
function resizeWT(rect){
    c.style.cursor="ne-resize";
    if(flag&&op==0){op=10;}
    if(flag&&op==10){
        if(!currentR){currentR=rect}
		currentR.x2=x
        currentR.y1=y
        currentR.height=currentR.y2-currentR.y1
		currentR.width=currentR.x2-currentR.x1
    }
}
function reshow(x,y){
        let allNotIn=1;
        layers.forEach(item=>{
            ctx.beginPath();
            ctx.rect(item.x1,item.y1,item.width,item.height);
            ctx.strokeStyle=item.strokeStyle
            if(x>=(item.x1-25/scale)&&x<=(item.x1+25/scale)&&y<=(item.y2-25/scale)&&y>=(item.y1+25/scale)){
                    resizeLeft(item);
            }else if(x>=(item.x2-25/scale)&&x<=(item.x2+25/scale)&&y<=(item.y2-25/scale)&&y>=(item.y1+25/scale)){
                    resizeWidth(item);
            }else if(y>=(item.y1-25/scale)&&y<=(item.y1+25/scale)&&x<=(item.x2-25/scale)&&x>=(item.x1+25/scale)){
                    resizeTop(item);
            }else if(y>=(item.y2-25/scale)&&y<=(item.y2+25/scale)&&x<=(item.x2-25/scale)&&x>=(item.x1+25/scale)){
                    resizeHeight(item);
            }else if(x>=(item.x1-25/scale)&&x<=(item.x1+25/scale)&&y<=(item.y1+25/scale)&&y>=(item.y1-25/scale)){
                    resizeLT(item);
            }else if(x>=(item.x2-25/scale)&&x<=(item.x2+25/scale)&&y<=(item.y2+25/scale)&&y>=(item.y2-25/scale)){
                    resizeWH(item);
            }else if(x>=(item.x1-25/scale)&&x<=(item.x1+25/scale)&&y<=(item.y2+25/scale)&&y>=(item.y2-25/scale)){
                    resizeLH(item);
            }else if(x>=(item.x2-25/scale)&&x<=(item.x2+25/scale)&&y<=(item.y1+25/scale)&&y>=(item.y1-25/scale)){
                    resizeWT(item);
            }
            if(ctx.isPointInPath(x*scale,y*scale)){
				render(item);
                allNotIn=0;
            }
            ctx.stroke();
        })
    if(flag&&allNotIn&&op<3){
        op=1
    }

}
function render(rect){
    c.style.cursor="move";
    if(flag&&op==0){op=2;}
    if(flag&&op==2){
        if(!currentR){currentR=rect}
        currentR.x2+=x-leftDistance-currentR.x1
        currentR.x1+=x-leftDistance-currentR.x1
        currentR.y2+=y-topDistance-currentR.y1
        currentR.y1+=y-topDistance-currentR.y1
    }
}
function isPointInRetc(x,y){
    let len=layers.length;
    for(let i=0;i<len;i++){
        if(layers[i].x1<x&&x<layers[i].x2&&layers[i].y1<y&&y<layers[i].y2){
            return layers[i];
        }
    }
}
function fixPosition(position){
    if(position.x1>position.x2){
        let x=position.x1;
        position.x1=position.x2;
        position.x2=x;
    }
    if(position.y1>position.y2){
        let y=position.y1;
        position.y1=position.y2;
        position.y2=y;
    }
    position.width=position.x2-position.x1
    position.height=position.y2-position.y1
	if(position.width<50||position.height<50){
		position.width=60;
		position.height=60;
		position.x2+=position.x1+60;
		position.y2+=position.y1+60;
	}
    return position
}
let mousedown=function(e){
    startx=(e.pageX-c.offsetLeft+c.parentElement.scrollLeft)/scale;
    starty=(e.pageY-c.offsetTop+c.parentElement.scrollTop)/scale;
    currentR=isPointInRetc(startx,starty);
    if(currentR){
        leftDistance=startx-currentR.x1;
        topDistance=starty-currentR.y1;
    }
    ctx.strokeRect(x,y,0,0);
    ctx.strokeStyle="#0000ff";
    flag=1;
}
let mousemove=function(e){
    x=(e.pageX-c.offsetLeft+c.parentElement.scrollLeft)/scale;
    y=(e.pageY-c.offsetTop+c.parentElement.scrollTop)/scale;
    ctx.save();
    ctx.setLineDash([5])
    c.style.cursor="default";
    ctx.clearRect(0,0,elementWidth,elementHeight)
    if(flag&&op==1){
        ctx.strokeRect(startx,starty,x-startx,y-starty);
    }
    ctx.restore();
    reshow(x,y);
}
let mouseup=function(e){
    if(op==1){
        layers.push(fixPosition({
            x1:startx,
            y1:starty,
            x2:x,
            y2:y,
			strokeStyle:'#0000ff',
			type:type
        }))
    }else if(op>=3){
		fixPosition(currentR)
	}
	currentR=null;
    flag=0;
    reshow(x,y);
    op=0;
}
c.onmouseleave=function(){
    c.onmousedown=null;
    c.onmousemove=null;
    c.onmouseup=null;
}
c.onmouseenter=function(){
    c.onmousedown=mousedown;
    c.onmousemove=mousemove;
    document.onmouseup=mouseup;
}

})();



