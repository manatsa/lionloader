

const showToast=(ref,severity, summary, detail)=>{
    ref.current.show({
        severity,
        summary,
        detail
    });
}

export default showToast;