import React, { useState, useEffect } from 'react';
import { Form, Button, TimePicker, Typography, Card, message, Row, Col } from 'antd';
import axios from 'axios';
import moment, { Moment } from 'moment';
import Select from 'react-select';
import './estilos/AssignSchedule.css';

const { Title } = Typography;

interface Horario {
  entrada: Moment;
  recesoInicio: Moment;
  recesoFin: Moment;
  salida: Moment;
}

interface Alumno {
  value: string;
  label: string;
}

interface Props {
  studentId: string;
}

const AssignSchedule: React.FC<Props> = ({ studentId }) => {
  const [loading, setLoading] = useState(false);
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);

  useEffect(() => {
    const fetchAlumnos = async () => {
      try {
        const response = await axios.get('https://entradas-backend.vercel.app/students');
        const alumnosData = response.data.map((alumno: any) => ({
          value: alumno.id,
          label: alumno.name,
        }));
        setAlumnos(alumnosData);
      } catch (error) {
        console.error('Error fetching alumnos:', error);
        message.error('Error al obtener los alumnos');
      }
    };

    fetchAlumnos();
  }, []);

  const onFinish = async (values: any) => {
    setLoading(true);

    const horario: Horario = {
      entrada: values.entrada,
      recesoInicio: values.recesoInicio,
      recesoFin: values.recesoFin,
      salida: values.salida,
    };

    try {
      const url = `https://entradas-backend.vercel.app/students/${studentId}/schedule`;
      const response = await axios.put(url, {
        horario: {
          entrada: horario.entrada.format('HH:mm'),
          recesoInicio: horario.recesoInicio.format('HH:mm'),
          recesoFin: horario.recesoFin.format('HH:mm'),
          salida: horario.salida.format('HH:mm'),
        }
      });

      if (response.status === 200) {
        message.success('Horario asignado con éxito');
      } else {
        message.error('Error al asignar el horario');
      }
    } catch (error) {
      console.error('Error:', error);
      message.error('Error al asignar el horario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="assign-schedule-container">
      <Card bordered={false} className="assign-schedule-card">
        <Title level={2} className="assign-schedule-title">Asignar Horarios</Title>
        <Form
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            entrada: moment('08:00', 'HH:mm'),
            recesoInicio: moment('10:00', 'HH:mm'),
            recesoFin: moment('10:30', 'HH:mm'),
            salida: moment('14:00', 'HH:mm'),
          }}
          className="assign-schedule-form"
        >
          <Form.Item
            label="Alumnos"
            name="alumnos"
            rules={[{ required: true, message: 'Por favor, seleccione al menos un alumno' }]}
          >
            <Select
              isMulti
              name="alumnos"
              options={alumnos}
              className="basic-multi-select"
              classNamePrefix="select"
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Hora de Entrada"
                name="entrada"
                rules={[{ required: true, message: 'Por favor, ingrese la hora de entrada' }]}
              >
                <TimePicker format={'HH:mm'} />
              </Form.Item>

              <Form.Item
                label="Hora de Salida"
                name="salida"
                rules={[{ required: true, message: 'Por favor, ingrese la hora de salida' }]}
              >
                <TimePicker format={'HH:mm'} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Inicio del Receso"
                name="recesoInicio"
                rules={[{ required: true, message: 'Por favor, ingrese la hora de inicio del receso' }]}
              >
                <TimePicker format={'HH:mm'} />
              </Form.Item>

              <Form.Item
                label="Fin del Receso"
                name="recesoFin"
                rules={[{ required: true, message: 'Por favor, ingrese la hora de fin del receso' }]}
              >
                <TimePicker format={'HH:mm'} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block className="assign-schedule-button">
              Asignar Horario
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AssignSchedule;
