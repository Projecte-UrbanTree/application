import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from 'primereact/button'
import { Calendar } from 'primereact/calendar'
import { MultiSelect } from 'primereact/multiselect'
import { Dropdown } from 'primereact/dropdown'
import { InputTextarea } from 'primereact/inputtextarea'
import { Card } from 'primereact/card'
import { Icon } from '@iconify/react'
import { Divider } from 'primereact/divider'
import { Panel } from 'primereact/panel'
import CrudPanel from '@/components/Admin/CrudPanel'
import { useTranslation } from 'react-i18next'
import axiosClient from '@/api/axiosClient'

interface TaskType { id: number; name: string }
interface TreeType { id: number; species: string }
interface ElementType { id: number; name: string; requires_tree_type: boolean }
interface User { id: number; name: string; surname: string }
interface Zone { id: number; name: string }

interface WorkBlock {
  zoneIds: number[]
  tasks: {
    taskType: TaskType | null
    elementType: ElementType | null
    treeType: TreeType | null
  }[]
  notes: string
}

export default function CreateWorkOrder() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [date, setDate] = useState<Date | null>(null)
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])
  const [blocks, setBlocks] = useState<WorkBlock[]>([{
    zoneIds: [],
    tasks: [{ taskType: null, elementType: null, treeType: null }],
    notes: '',
  }])
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<User[]>([])
  const [taskTypes, setTaskTypes] = useState<TaskType[]>([])
  const [elementTypes, setElementTypes] = useState<ElementType[]>([])
  const [treeTypes, setTreeTypes] = useState<TreeType[]>([])
  const [zones, setZones] = useState<Zone[]>([])

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axiosClient.get('/admin/work-orders/create')
        setUsers(response.data.users || [])
        setTaskTypes(response.data.task_types || [])
        setElementTypes(response.data.element_types || [])
        setTreeTypes(response.data.tree_types || [])
        setZones(response.data.zones || [])
        setLoading(false)
      } catch (error) {
        console.error('Error loading form data:', error)
        setLoading(false)
      }
    }
    fetchFormData()
  }, [])

  const addBlock = () => {
    setBlocks(prev => [
      ...prev,
      {
        zoneIds: [],
        tasks: [{ taskType: null, elementType: null, treeType: null }],
        notes: '',
      },
    ])
  }

  const removeBlock = (index: number) => {
    setBlocks(prev => prev.filter((_, i) => i !== index))
  }

  const addTask = (blockIndex: number) => {
    setBlocks(prev => {
      const updated = [...prev]
      updated[blockIndex].tasks.push({ taskType: null, elementType: null, treeType: null })
      return updated
    })
  }

  const removeTask = (blockIndex: number, taskIndex: number) => {
    setBlocks(prev => {
      const updated = [...prev]
      updated[blockIndex].tasks.splice(taskIndex, 1)
      return updated
    })
  }

  const updateZones = (blockIndex: number, zoneIds: number[]) => {
    setBlocks(prev => {
      const updated = [...prev]
      updated[blockIndex].zoneIds = zoneIds
      return updated
    })
  }

  const updateTask = (blockIndex: number, taskIndex: number, field: string, value: any) => {
    setBlocks(prev => {
      const updated = [...prev]
      updated[blockIndex].tasks[taskIndex] = {
        ...updated[blockIndex].tasks[taskIndex],
        [field]: value
      }
      if (field === 'elementType' && value && !value.requires_tree_type) {
        updated[blockIndex].tasks[taskIndex].treeType = null
      }
      return updated
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload = {
        date: date?.toISOString().split('T')[0],
        user_ids: selectedUsers.map(u => u.id),
        blocks: blocks.map(b => ({
          zone_ids: b.zoneIds,
          tasks: b.tasks.map(t => ({
            task_type_id: t.taskType?.id,
            element_type_id: t.elementType?.id,
            tree_type_id: t.treeType?.id,
          })),
          notes: b.notes
        }))
      }
      await axiosClient.post('/admin/work-orders', payload)
      navigate('/admin/work-orders', {
        state: { success: t('admin.pages.workOrders.messages.createSuccess') }
      })
    } catch (error) {
      console.error('Error creating work order:', error)
    }
  }

  return (
    <CrudPanel title={t('admin.pages.workOrders.create.title')}>
      {loading ? (
        <div className="flex justify-center p-6">
          <i className="pi pi-spin pi-spinner text-4xl"></i>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-fluid">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <div className="field">
              <label htmlFor="date" className="font-medium mb-2 block flex items-center gap-1">
                <Icon icon="tabler:calendar" className="inline-block" />
                {t('admin.fields.date') || 'Fecha'}
              </label>
              <Calendar
                id="date"
                value={date}
                onChange={(e) => setDate(e.value as Date)}
                showIcon
                dateFormat="dd/mm/yy"
                required
                className="w-full"
              />
            </div>
            <div className="field">
              <label htmlFor="users" className="font-medium mb-2 block flex items-center gap-1">
                <Icon icon="tabler:users" className="inline-block" />
                {t('admin.fields.workers') || 'Operarios'}
              </label>
              <MultiSelect
                id="users"
                value={selectedUsers}
                options={users}
                onChange={(e) => setSelectedUsers(e.value)}
                optionLabel="name"
                itemTemplate={(option: User) => `${option.name} ${option.surname}`}
                placeholder={t('admin.fields.selectWorkers') || 'Seleccionar operarios'}
                display="chip"
                filter
                className="w-full"
              />
            </div>
          </div>

          <div className="flex justify-between my-4 items-center">
            <h2 className="text-xl font-bold flex items-center gap-1">
              <Icon icon="tabler:box" />
              {t('admin.pages.workOrders.create.blocksTitle') || 'Bloques de trabajo'}
            </h2>
            <Button
              type="button"
              icon="pi pi-plus"
              label={t('admin.pages.workOrders.create.addBlock') || 'Añadir bloque'}
              onClick={addBlock}
              severity="success"
            />
          </div>

          <Divider />

          {blocks.map((block, blockIndex) => (
            <Card
              key={blockIndex}
              className="mb-4 shadow-none border border-gray-300"
              title={
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">
                    {t('admin.pages.workOrders.create.blockLabel') || 'Bloque'} {blockIndex + 1}
                  </span>
                  <Button
                    icon="pi pi-trash"
                    onClick={() => removeBlock(blockIndex)}
                    severity="danger"
                    text
                    disabled={blocks.length === 1}
                  />
                </div>
              }
            >
              <div className="mb-4">
                <label className="font-medium mb-2 block flex items-center gap-1">
                  <Icon icon="tabler:map-pin" />
                  {t('admin.fields.zones') || 'Zonas'}
                </label>
                <MultiSelect
                  value={block.zoneIds}
                  options={zones}
                  onChange={(e) => updateZones(blockIndex, e.value)}
                  optionLabel="name"
                  optionValue="id"
                  placeholder={t('admin.fields.selectZones') || 'Seleccionar zonas'}
                  display="chip"
                  filter
                  className="w-full"
                />
              </div>

              <Panel
                className="p-0"
                header={
                  <div className="flex justify-between items-center">
                    <span className="font-medium flex items-center gap-1">
                      <Icon icon="tabler:list-check" />
                      {t('admin.pages.workOrders.create.tasksTitle') || 'Tareas'}
                    </span>
                    <Button
                      icon="pi pi-plus"
                      label={t('admin.pages.workOrders.create.addTask') || 'Añadir tarea'}
                      onClick={() => addTask(blockIndex)}
                      severity="success"
                      size="small"
                    />
                  </div>
                }
              >
                {block.tasks.map((task, taskIndex) => (
                  <div key={taskIndex} className="p-3 border-b last:border-b-0 border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-semibold">
                        {t('admin.pages.workOrders.create.taskLabel') || 'Tarea'} {taskIndex + 1}
                      </h4>
                      <Button
                        icon="pi pi-trash"
                        onClick={() => removeTask(blockIndex, taskIndex)}
                        severity="danger"
                        text
                        disabled={block.tasks.length === 1}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="field">
                        <label className="text-sm font-medium mb-1 block">
                          {t('admin.pages.workOrders.create.taskType') || 'Tipo de tarea'}
                        </label>
                        <Dropdown
                          value={task.taskType}
                          options={taskTypes}
                          onChange={(e) => updateTask(blockIndex, taskIndex, 'taskType', e.value)}
                          optionLabel="name"
                          placeholder={t('admin.pages.workOrders.create.selectTask') || 'Seleccione tarea'}
                          className="w-full"
                        />
                      </div>

                      <div className="field">
                        <label className="text-sm font-medium mb-1 block">
                          {t('admin.pages.workOrders.create.elementType') || 'Tipo de elemento'}
                        </label>
                        <Dropdown
                          value={task.elementType}
                          options={elementTypes}
                          onChange={(e) => updateTask(blockIndex, taskIndex, 'elementType', e.value)}
                          optionLabel="name"
                          placeholder={t('admin.pages.workOrders.create.selectElement') || 'Seleccione elemento'}
                          className="w-full"
                        />
                      </div>

                      <div className="field">
                        <label className="text-sm font-medium mb-1 block">
                          {t('admin.pages.workOrders.create.species') || 'Especie'}
                        </label>
                        <Dropdown
                          value={task.treeType}
                          options={treeTypes}
                          onChange={(e) => updateTask(blockIndex, taskIndex, 'treeType', e.value)}
                          optionLabel="species"
                          placeholder={t('admin.pages.workOrders.create.selectSpecies') || 'Seleccione especie'}
                          className="w-full"
                          disabled={!task.elementType || !task.elementType.requires_tree_type}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </Panel>

              <div className="field mt-4">
                <label className="font-medium mb-2 block flex items-center gap-1">
                  <Icon icon="tabler:note" />
                  {t('admin.fields.notes') || 'Notas'}
                </label>
                <InputTextarea
                  value={block.notes}
                  onChange={(e) => {
                    const updated = [...blocks]
                    updated[blockIndex].notes = e.target.value
                    setBlocks(updated)
                  }}
                  rows={3}
                  autoResize
                  placeholder={t('admin.pages.workOrders.create.notesPlaceholder') || 'Notas adicionales...'}
                  className="w-full"
                />
              </div>
            </Card>
          ))}

          <div className="flex justify-end mt-4 gap-2">
            <Button
              type="button"
              label={t('general.cancel') || 'Cancelar'}
              icon="pi pi-times"
              onClick={() => navigate('/admin/work-orders')}
              severity="secondary"
              className="p-button-outlined"
            />
            <Button
              type="submit"
              label={t('admin.pages.workOrders.create.submitButton') || 'Crear orden de trabajo'}
              icon="pi pi-check"
              severity="success"
            />
          </div>
        </form>
      )}
    </CrudPanel>
  )
}
