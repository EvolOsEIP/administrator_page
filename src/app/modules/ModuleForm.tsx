"use client"

import { useState, useEffect } from "react"
import ModuleCreation from "./ModuleCreation"
import ModuleContent from "./ModuleContent"
import { MinusCircle } from "lucide-react"
import RequireAuth from "../components/utils/RequireAuth"

interface Module {
  moduleId: number
  moduleName: string
}

interface ModalProps {
  selectedModule: Module | null
  showModuleCreation: boolean
  setShowModuleCreation: (show: boolean) => void
  getModules: () => void
}

const Modal = ({ selectedModule,
               showModuleCreation,
               setShowModuleCreation,
               getModules }: ModalProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg relative w-full">
      {selectedModule ? (

        <ModuleContent
          moduleId={selectedModule.moduleId}
          moduleName={selectedModule.moduleName}
        />
       // <CourseForm
       //   moduleName={selectedModule.moduleName}
       //   moduleId={selectedModule.moduleId}
       // />
      ) : (
        <p className="text-gray-500">Aucun module sélectionné</p>
      )}

      {showModuleCreation && (
        <ModuleCreation
          onClose={() => {
            setShowModuleCreation(false)
            getModules()
          }}
        />
      )}
    </div>
  )
}

const ModuleForm = () => {
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedModule, setSelectedModule] = useState<Module | null>(null)
  const [deleteModule, setDeleteModule] = useState<Module | null>(null)
  const [showModuleCreation, setShowModuleCreation] = useState(false)

  const removeModule = async (moduleId: number) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/modules/${moduleId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
        },
      })

      if (!res.ok) throw new Error("Network response was not ok")

      // Refresh modules after deletion
      console.log(`Deleting module with ID: ${moduleId}`)
      console.log("Response status:", res.status)
      getModules()
    } catch (error) {
      console.error("There has been a problem with your fetch operation:", error)
      setError("Failed to delete module")
    } finally {
      setLoading(false)
    }
    alert("Module deleted successfully")
  }

  const getModules = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/roadmap`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Use localStorage to get the token
        },
      })

      if (!res.ok) throw new Error("Network response was not ok")

      const data = await res.json()
      setModules(data)
    } catch (error) {
      console.error("There has been a problem with your fetch operation:", error)
      setError("Failed to fetch modules")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getModules()
  }, [])

  const handleModuleClick = (module: Module) => {
    if (selectedModule?.moduleId === module.moduleId) {
      setSelectedModule(null) // Deselect if already selected
    } else {
      setSelectedModule(module)
    }
  }

  return (
    <>
    <RequireAuth />
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-black">Module Form</h1>

      <div className="mb-4">
        <button
          onClick={getModules}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh Modules"}
        </button>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="flex gap-6 relative min-h-[400px]">
        {/* Sidebar: Modules List */}
        <div className="md:w-1/3">
          {modules.length > 0 ? (
            <ul className="space-y-2">
              {modules.map((module) => (

              <li
                key={module.moduleId}
                className={`group w-40 h-13 p-3 border rounded text-black cursor-pointer transition-colors flex items-center justify-between relative ${
                  selectedModule?.moduleId === module.moduleId
                    ? "bg-blue-100 border-blue-500"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => handleModuleClick(module)}
              >
                <h3 className="font-medium truncate overflow-hidden text-ellipsis whitespace-nowrap">{module.moduleName}</h3>

                {/* Delete icon shown on hover */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation() // prevent triggering select
                    setDeleteModule(module)
                  }}
                  className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Supprimer le module"
                >
                  <MinusCircle size={20} />
                </button>
              </li>
              ))}
              <li>
                <button
                  className="w-40 p-3 border rounded bg-green-500 text-white hover:bg-green-600 transition-colors"
                  onClick={() => {
                    setShowModuleCreation(true)
                    setSelectedModule(null)
                  }}
                >
                  Create New Module
                </button>
              </li>
            </ul>
          ) : loading ? (
            <p>Loading modules...</p>
          ) : (
            <p>No modules found</p>
          )}
        </div>

        {/* Main Panel: Course Form or Module Creation */}

        <div className="flex items-center justify-center md:w-2/3">
          {(selectedModule || showModuleCreation) ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              {/* Backdrop */}
              <div
                className="absolute inset-0 backdrop-blur-sm"
                onClick={() => {
                  setSelectedModule(null)
                  setShowModuleCreation(false)
                }}
              ></div>

              {/* Modal Content */}
              <div className="relative z-10 w-[90%] max-w-4xl">
                <Modal
                  selectedModule={selectedModule}
                  showModuleCreation={showModuleCreation}
                  setShowModuleCreation={setShowModuleCreation}
                  getModules={getModules}
                />
              </div>
            </div>
          ) : (
            <p className="text-gray-500"></p>
          )}

          {deleteModule && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 backdrop-blur-sm"
              onClick={() => {
                setSelectedModule(null)
                setShowModuleCreation(false)
              }}
            ></div>

            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteModule(null)}></div>
                <div className="bg-white p-6 rounded-lg shadow-lg relative w-full max-w-md z-10">
                  <h2 className="text-xl text-black font-bold mb-4">Supprimer le module</h2>
                  <p className="text-black">Es-tu sûr de vouloir supprimer ce module ?</p>
                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      onClick={() => setDeleteModule(null)}
                      className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={() => {
                        if (selectedModule) {
                          setSelectedModule(null) // clear selection if deleted
                        }
                        removeModule(deleteModule.moduleId)
                        setDeleteModule(null)
                      }}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </>
  )
}

export default ModuleForm