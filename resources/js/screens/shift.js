import React, {Component} from 'react'
import Scheduler, {SchedulerData, ViewTypes, DATE_FORMAT, DemoData} from 'react-big-scheduler'
import 'react-big-scheduler/lib/css/style.css'
import moment from 'moment'
import withDragDropContext from './example/withDnDContext'
import AddResourceForm from './example/AddResourceForm'

class Shift extends Component{
  constructor(props){
    super(props);
    console.log(DemoData);

    moment.locale('ja');
    let schedulerData = new SchedulerData(new moment().format(DATE_FORMAT), ViewTypes.Day, false, false, {
      resourceName: 'ユーザー名',
      dayMaxEvents: 1,
      monthMaxEvents: 1,
      addMorePopoverHeaderFormat: 'YYYY年M月D日 dddd',
      eventItemPopoverDateFormat: 'M月D日',
      nonAgendaDayCellHeaderFormat: 'HH',
      nonAgendaOtherCellHeaderFormat: 'D（ddd）',
      views: [
        {viewName: '日', viewType: ViewTypes.Day, showAgenda: false, isEventPerspective: false},
        {viewName: '月', viewType: ViewTypes.Month, showAgenda: false, isEventPerspective: false},
      ]
    }, {
      getDateLabelFunc: this.getDateLabel,
      isNonWorkingTimeFunc: this.isNonWorkingTime
    }, moment)
    schedulerData.localeMoment.locale('ja');
    schedulerData.setResources(DemoData.resources);
    schedulerData.setEvents(DemoData.events);
    schedulerData.setMinuteStep(15);
    
    this.state = {
      viewModel: schedulerData
    }
  }
  showModal = () => {
    this.setState({ visible: true });
  }
  handleCancel = () => {
    this.setState({ visible: false });
  }
  handleCreate = () => {
    const form = this.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.addResource(values.name)
      form.resetFields();
      this.setState({ visible: false });
    });
    
  }
  saveFormRef = (form) => {
    this.form = form;
  }

  render(){
    const {viewModel} = this.state;

    let leftCustomHeader = (
      <div>
        <span style={{ fontWeight: 'bold' }}><a onClick={this.showModal}>ユーザーを追加</a></span>
        <AddResourceForm
          ref={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          addResource={this.addResource}
        />
      </div>
    );

    return (
      <div>
        <h3 style={{textAlign: 'center'}}>Calender Sample</h3>
        <Scheduler 
          schedulerData={viewModel}
          prevClick={this.prevClick}
          nextClick={this.nextClick}
          onSelectDate={this.onSelectDate}
          onViewChange={this.onViewChange}
          eventItemClick={this.eventClicked}
          viewEventClick={this.ops1}
          viewEventText="Ops 1"
          viewEvent2Text="Ops 2"
          viewEvent2Click={this.ops2}
          updateEventStart={this.updateEventStart}
          updateEventEnd={this.updateEventEnd}
          moveEvent={this.moveEvent}
          newEvent={this.newEvent}
          leftCustomHeader={leftCustomHeader}
          eventItemTemplateResolver={this.eventItemTemplateResolver}
          toggleExpandFunc={this.toggleExpandFunc}
        />
      </div>
    )
  }

  prevClick = (schedulerData)=> {
    schedulerData.prev();
    schedulerData.setEvents(DemoData.events);
    this.setState({
      viewModel: schedulerData
    })
  }

  nextClick = (schedulerData)=> {
    schedulerData.next();
    schedulerData.setEvents(DemoData.events);
    this.setState({
      viewModel: schedulerData
    })
  }

  onViewChange = (schedulerData, view) => {
    schedulerData.setViewType(view.viewType, view.showAgenda, view.isEventPerspective);
    schedulerData.setEvents(DemoData.events);
    this.setState({
      viewModel: schedulerData
    })
  }

  onSelectDate = (schedulerData, date) => {
    schedulerData.setDate(date);
    schedulerData.setEvents(DemoData.events);
    this.setState({
      viewModel: schedulerData
    })
  }

  eventClicked = (schedulerData, event) => {
    alert(`You just clicked an event: {id: ${event.id}, title: ${event.title}}`);
  };

  ops1 = (schedulerData, event) => {
    alert(`You just executed ops1 to event: {id: ${event.id}, title: ${event.title}}`);
  };

  ops2 = (schedulerData, event) => {
    alert(`You just executed ops2 to event: {id: ${event.id}, title: ${event.title}}`);
  };

  newEvent = (schedulerData, slotId, slotName, start, end, type, item) => {
    if(confirm(`Do you want to create a new event? {slotId: ${slotId}, slotName: ${slotName}, start: ${start}, end: ${end}, type: ${type}, item: ${item}}`)){

      let newFreshId = 0;
      schedulerData.events.forEach((item) => {
        if(item.id >= newFreshId)
          newFreshId = item.id + 1;
      });

      let newEvent = {
        id: newFreshId,
        title: 'New event you just created',
        start: start,
        end: end,
        resourceId: slotId,
        bgColor: 'purple'
      }
      schedulerData.addEvent(newEvent);
      this.setState({
        viewModel: schedulerData
      })
    }
  }

  updateEventStart = (schedulerData, event, newStart) => {
    if(confirm(`Do you want to adjust the start of the event? {eventId: ${event.id}, eventTitle: ${event.title}, newStart: ${newStart}}`)) {
      schedulerData.updateEventStart(event, newStart);
    }
    this.setState({
      viewModel: schedulerData
    })
  }

  updateEventEnd = (schedulerData, event, newEnd) => {
    if(confirm(`Do you want to adjust the end of the event? {eventId: ${event.id}, eventTitle: ${event.title}, newEnd: ${newEnd}}`)) {
      schedulerData.updateEventEnd(event, newEnd);
    }
    this.setState({
      viewModel: schedulerData
    })
  }

  moveEvent = (schedulerData, event, slotId, slotName, start, end) => {
    if(confirm(`Do you want to move the event? {eventId: ${event.id}, eventTitle: ${event.title}, newSlotId: ${slotId}, newSlotName: ${slotName}, newStart: ${start}, newEnd: ${end}`)) {
      schedulerData.moveEvent(event, slotId, slotName, start, end);
      this.setState({
        viewModel: schedulerData
      })
    }
  }

  getDateLabel = (schedulerData, viewType, startDate, endDate) => {
    let start = schedulerData.localeMoment(startDate);
    let end = schedulerData.localeMoment(endDate);
    let dateLabel = start.format('YYYY年M月D日（ddd）');

    if (viewType === ViewTypes.Month) {
      dateLabel = start.format('YYYY年M月');
    }

    return dateLabel;
}

isNonWorkingTime = (schedulerData, time) => {
    const { localeMoment } = schedulerData;
    if(schedulerData.viewType === ViewTypes.Day){
        let hour = localeMoment(time).hour();
        if(hour < 10 || hour > 19)
            return true;
    }
    else {
        let dayOfWeek = localeMoment(time).weekday();
        if (dayOfWeek === 5 || dayOfWeek === 6)
            return true;
    }

    return false;
}

  addResource = (resourceName) => {
    let schedulerData = this.state.viewModel;
    let newFreshId = schedulerData.resources.length + 1;
    let newFreshName = resourceName;
    schedulerData.addResource({id: newFreshId, name: newFreshName});
    this.setState({
      viewModel: schedulerData
    })
  }

  eventItemTemplateResolver = (schedulerData, event, bgColor, isStart, isEnd, mustAddCssClass, mustBeHeight, agendaMaxEventWidth) => {
    let borderWidth = isStart ? '4' : '0';
    let borderColor =  'rgba(0,139,236,1)', backgroundColor = '#80C5F6';
    let titleText = schedulerData.behaviors.getEventTextFunc(schedulerData, event);
    if(!!event.type) {
      borderColor = event.type == 1 ? 'rgba(0,139,236,1)' : (event.type == 3 ? 'rgba(245,60,43,1)' : '#999');
      backgroundColor = event.type == 1 ? '#80C5F6' : (event.type == 3 ? '#FA9E95' : '#D9D9D9');
    }
    let divStyle = {borderLeft: borderWidth + 'px solid ' + borderColor, backgroundColor: backgroundColor, height: mustBeHeight };
    if(!!agendaMaxEventWidth) {
      divStyle = {...divStyle, maxWidth: agendaMaxEventWidth};
    }

    return <div key={event.id} className={mustAddCssClass} style={divStyle}>
      <span style={{marginLeft: '4px', lineHeight: `${mustBeHeight}px` }}>{titleText}</span>
    </div>;
}

  toggleExpandFunc = (schedulerData, slotId) => {
    schedulerData.toggleExpandStatus(slotId);
    this.setState({
      viewModel: schedulerData
    });
  }
}

export default withDragDropContext(Shift)