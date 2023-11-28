

const showToast=(ref,severity, summary, detail)=>{
    if(ref!=null && ref?.current!=null) {
        ref.current.show({
            severity,
            summary,
            detail
        });
    }
}

export default showToast;