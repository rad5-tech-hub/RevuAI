// QRModal Component
export const QRModal = ({ showModal, setShowModal, modalCanvasRef, generatedQrData, primaryColor }) => (
  <>
    {showModal && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
        <div className="bg-white p-6 rounded-xl relative" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setShowModal(false)}
            className="absolute top-2 right-2 text-slate-500 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
          <canvas ref={modalCanvasRef} className="mx-auto" />
        </div>
      </div>
    )}
  </>
);