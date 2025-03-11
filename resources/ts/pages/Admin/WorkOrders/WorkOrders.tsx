import { useState, useEffect } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Badge } from 'primereact/badge'
import { Message } from 'primereact/message'
import { Icon } from '@iconify/react'
import axiosClient from '@/api/axiosClient'
import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation } from 'react-router-dom'
import CrudPanel from '@/components/Admin/CrudPanel'
import { Accordion, AccordionTab } from 'primereact/accordion'
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"

interface WorkOrderBlockTask {
  id: number
  element_type: { name: string }
  tasks_type: { name: string }
  tree_type?: { species: string } | null
}

interface WorkOrderBlock {
  id: number
  notes: string
  zones: { id: number; name: string }[]
  block_tasks?: WorkOrderBlockTask[]
}

interface WorkReport {
  id: number
  observation: string
  spent_fuel: number
  report_status: number
  report_incidents: string
}

interface WorkOrder {
  id: number
  date: string
  status: number
  contract: { name: string }
  users: { id: number; name: string; surname: string }[]
  work_orders_blocks: WorkOrderBlock[]
  work_reports?: WorkReport[]
}

export default function WorkOrders() {
  const [isLoading, setIsLoading] = useState(true)
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([])
  const [expandedRows, setExpandedRows] = useState<any>({})
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const successMsg = location.state?.success
  const errorMsg = location.state?.error
  const [msg, setMsg] = useState<string | null>(successMsg || errorMsg || null)
  const [msgSeverity, setMsgSeverity] = useState<'success' | 'error'>(successMsg ? 'success' : 'error')
  const currentContract = useSelector((state: RootState) => state.contract.currentContract)
  useEffect(() => {
    if (location.state) window.history.replaceState({}, document.title)
  }, [location])
  useEffect(() => {
    if (msg) {
      const timer = setTimeout(() => setMsg(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [msg])
  useEffect(() => {
    const fetchWorkOrders = async () => {
      try {
        const response = await axiosClient.get('/admin/work-orders')
        const transformedData = response.data.map((order: any) => ({
          ...order,
          workOrdersBlocks: order.work_orders_blocks
        }))
        setWorkOrders(transformedData)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching work orders:', error)
        setIsLoading(false)
      }
    }
    fetchWorkOrders()
  }, [])
  const handleDelete = (id: number) => {
    if (window.confirm(t('admin.pages.workOrders.deleteConfirm'))) {
      axiosClient.delete(`/admin/work-orders/${id}`)
        .then(() => {
          setWorkOrders(workOrders.filter((wo: any) => wo.id !== id))
          setMsg(t('admin.pages.workOrders.deleteSuccess'))
        })
        .catch((error) => {
          console.error('Error deleting work order:', error)
          setMsg(t('admin.pages.workOrders.deleteError'))
        })
    }
  }
  useEffect(() => {
    console.log('Expanded rows:', expandedRows)
  }, [expandedRows])
  const rowExpansionTemplate = (data: WorkOrder) => {
    const activeTabs = data.work_orders_blocks.map((_, i) => i)
    return (
      <div className="p-4 bg-gray-50">
        <Accordion multiple activeIndex={activeTabs}>
          {data.work_orders_blocks?.length ? (
            data.work_orders_blocks.map((block, index) => {
              const tasks = block.block_tasks || block['block_tasks'] || []
              return (
                <AccordionTab key={block.id} header={<>Bloque {index + 1}</>}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-medium flex items-center gap-2">
                        <Icon icon="tabler:map-pin" />
                        {t('admin.pages.workOrders.zones')}
                      </h4>
                      <ul className="list-disc pl-5">
                        {block.zones && block.zones.length > 0 ? (
                          block.zones.map(zone => <li key={zone.id}>{zone.name}</li>)
                        ) : (
                          <li>No zones assigned</li>
                        )}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium flex items-center gap-2">
                        <Icon icon="tabler:clipboard-list" />
                        {t('admin.pages.workOrders.tasks')}
                      </h4>
                      <ul className="list-disc pl-5">
                        {tasks && tasks.length > 0 ? (
                          tasks.map(task => {
                            const taskName = task.tasks_type?.name || 'Unknown'
                            const elementName = task.element_type?.name || 'Unknown'
                            const speciesName = task.tree_type?.species ? `: ${task.tree_type.species}` : ''
                            return (
                              <li key={task.id}>
                                {taskName} {elementName}{speciesName}
                              </li>
                            )
                          })
                        ) : (
                          <li>No tasks assigned</li>
                        )}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium flex items-center gap-2">
                        <Icon icon="tabler:note" />
                        {t('admin.pages.workOrders.notes')}
                      </h4>
                      <p>{block.notes || 'N/A'}</p>
                    </div>
                  </div>
                </AccordionTab>
              )
            })
          ) : (
            <AccordionTab header="No blocks">
              <p>No blocks available for this work order</p>
            </AccordionTab>
          )}
        </Accordion>
      </div>
    )
  }
  const filteredWorkOrders = workOrders.filter(
    (wo: any) => currentContract && wo.contract_id === currentContract.id
  )
  return (
    <>
      {msg && <Message severity={msgSeverity} text={msg} className="mb-4 w-full" />}
      <CrudPanel title="admin.pages.workOrders.title" onCreate={() => navigate('/admin/work-orders/create')}>
        <DataTable
          value={filteredWorkOrders}
          expandedRows={expandedRows}
          onRowToggle={(e) => setExpandedRows(e.data)}
          rowExpansionTemplate={rowExpansionTemplate}
          dataKey="id"
          paginator
          rows={10}
          stripedRows
          showGridlines
          loading={isLoading}
          emptyMessage={t('admin.pages.workOrders.noData')}
          className="p-datatable-sm"
        >
          <Column expander style={{ width: '3rem' }} className="expander-column" />
          <Column field="id" header={t('admin.pages.workOrders.columns.id')} body={(rowData) => `OT-${rowData.id}`} />
          <Column field="date" header={t('admin.pages.workOrders.columns.date')} body={(rowData) => new Date(rowData.date).toLocaleDateString()} />
          <Column header={t('admin.pages.workOrders.columns.users')} body={(rowData) =>
            rowData.users && rowData.users.length > 0
              ? rowData.users.map((user: { id: number; name: string; surname: string }) => `${user.name} ${user.surname}`).join(', ')
              : 'No users assigned'
          } />
          <Column header={t('admin.pages.workOrders.columns.status')} body={(rowData) => {
            switch (rowData.status) {
              case 0:
                return <Badge value={t('admin.pages.workOrders.status.notStarted')} severity="danger" />
              case 1:
                return <Badge value={t('admin.pages.workOrders.status.inProgress')} severity="warning" />
              case 2:
                return <Badge value={t('admin.pages.workOrders.status.completed')} severity="success" />
              case 3:
                return <Badge value={t('Work Report Sent')} severity="info" />
              default:
                return <Badge value={t('admin.pages.workOrders.status.unknown')} severity="secondary" />
            }
          }} />
          <Column header="Estat del Parte" body={(rowData) => {
            if (!rowData.work_reports || rowData.work_reports.length === 0) {
              return <Badge value="Pendent" severity="warning" />
            }
            const latestReport = rowData.work_reports[rowData.work_reports.length - 1]
            switch (latestReport.report_status) {
              case 0:
                return <Badge value="Pendent" severity="warning" />
              case 1:
                return <Badge value="Completat" severity="success" />
              case 2:
                return <Badge value="Rebutjat" severity="danger" />
              case 3:
                return <Badge value={t('Tancat amb Incidencies')} severity="danger" />
              default:
                return <Badge value={t('admin.pages.workReports.status.unknown')} severity="secondary" />
            }
          }} />
          <Column header={t('admin.pages.workOrders.actions')} body={(rowData) => {
            if (rowData.status === 3) {
              return (
                <div className="flex justify-end gap-2">
                  <Button icon={<Icon icon="tabler:eye" />} className="p-button-rounded p-button-info" onClick={() => navigate(`/admin/work-reports/${rowData.id}`)} title={t('admin.pages.workOrders.actionTypes.viewReport')} />
                </div>
              )
            }
            return (
              <div className="flex justify-end gap-2">
                <Button icon={<Icon icon="tabler:edit" />} className="p-button-rounded p-button-primary" onClick={() => navigate(`/admin/work-orders/edit/${rowData.id}`)} title={t('admin.pages.workOrders.actionTypes.edit')} />
                <Button icon={<Icon icon="tabler:trash" />} className="p-button-rounded p-button-danger" onClick={() => handleDelete(rowData.id)} title={t('admin.pages.workOrders.actionTypes.delete')} />
              </div>
            )
          }} />
        </DataTable>
      </CrudPanel>
    </>
  )
}
