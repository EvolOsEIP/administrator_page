"use client"

import { useState, useEffect } from "react"
import CourseForm from "./CourseForm"

interface Module {
  moduleId: number
  moduleName: string
}

const ModuleForm = () => {
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedModule, setSelectedModule] = useState<Module | null>(null)

  const getModules = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/roadmap`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${process.env.NEXT_PUBLIC_AUTHORIZATION_TOKEN}`,
        },
      })

      if (!res.ok) {
        throw new Error("Network response was not ok")
      }

      const data = await res.json()
      console.log("Modules:", data)
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
    setSelectedModule(module)
    console.log("Selected Module:", module.moduleId)
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Module Form</h1>

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          {modules.length > 0 ? (
            <div>
              <h2 className="text-xl font-semibold mb-2">Module List</h2>
              <ul className="space-y-2">
                {modules.map((module) => (
                  <li
                    key={module.moduleId}
                    className={`p-3 border rounded cursor-pointer transition-colors ${
                      selectedModule?.moduleId === module.moduleId ? "bg-blue-100 border-blue-500" : "hover:bg-gray-50"
                    }`}
                    onClick={() => handleModuleClick(module)}
                  >
                    <h3 className="font-medium">{module.moduleName}</h3>
                  </li>
                ))}
                <li>
                  <button
                    className="w-full p-3 border rounded bg-green-500 text-white hover:bg-green-600 transition-colors"
                    onClick={() => {
                      handleModuleClick({ moduleId: 0, moduleName: "Create New Module" })
                    }
                  >
                    Create New Module
                  </button>
                  </li>
              </ul>
            </div>
          ) : loading ? (
            <p>Loading modules...</p>
          ) : (
            <p>No modules found</p>
          )}
        </div>

        <div className="md:col-span-2">
          {selectedModule ? (
            <CourseForm moduleName={selectedModule.moduleName} moduleId={selectedModule.moduleId} />
          ) : (
            console.log("No module selected")
          )}
        </div>
      </div>
    </div>
  )
}

export default ModuleForm
