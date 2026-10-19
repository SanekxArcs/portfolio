export default function Loading() {
  return (
    <div
      className="studio-wrap"
      aria-busy="true"
      style={{paddingBlock: 100, minHeight: 600}}
    >
      <div
        className="loading-line"
        style={{width: '35%', height: 10, marginBottom: 35}}
      />
      <div
        className="loading-line"
        style={{width: '85%', height: 70, marginBottom: 24}}
      />
      <div
        className="loading-line"
        style={{width: '65%', height: 70, marginBottom: 40}}
      />
      <div className="loading-line" style={{width: '45%', height: 16}} />
    </div>
  )
}
